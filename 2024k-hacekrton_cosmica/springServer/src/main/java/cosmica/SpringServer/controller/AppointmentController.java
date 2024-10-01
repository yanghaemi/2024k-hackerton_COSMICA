package cosmica.SpringServer.controller;


import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.dto.forMapping.DateMapping;
import cosmica.SpringServer.dto.forMapping.OrderMapping;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.match.MatchService;
import cosmica.SpringServer.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.text.ParseException;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/appointment")
@Slf4j
//동행자 매칭 관련 컨트롤러
public class AppointmentController {

    private final MatchService matchService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<Date,Appointment>> dateRegister(@SessionAttribute(name="user")User user, @RequestBody Appointment appointment)
    {
        log.info(user.toString());
        log.info(appointment.toString());
        Appointment registeredAppointment = matchService.registerAppointment(user, appointment);
        Map<Date,Appointment> mapAppointment = new HashMap<Date,Appointment>();
        mapAppointment.put(registeredAppointment.getAppointDate(),registeredAppointment);
        return ResponseEntity.ok().body(mapAppointment);
    }

    @PostMapping("/search")
    public ResponseEntity<List<Appointment>> dateSearch(@RequestBody DateMapping dateStr, @SessionAttribute(name="user")User user) throws ParseException {
        log.info(dateStr.getDateString());
        List<Appointment> appointments = matchService.searchAppointmentByDate(Date.valueOf(dateStr.getDateString()));
        return ResponseEntity.ok().body(appointments);
    }

    @PostMapping("/my")
    public ResponseEntity<List<Appointment>> lookupMyAppointment(@SessionAttribute(name="user")User user)
    {
        List<Appointment> appointments = matchService.searchAppointmentByUser(user);
        log.info(appointments.toString());
        return ResponseEntity.ok().body(appointments);
    }

    @PostMapping("/pay")
    public ResponseEntity<JSONObject> payMatch(@RequestBody OrderMapping orderMapping, @SessionAttribute(name = "user") User user) {
        JSONObject obj = new JSONObject();
        obj.put("orderId", orderMapping.getOrderId());
        obj.put("amount", orderMapping.getAmount());
        obj.put("paymentKey", orderMapping.getPaymentKey());
        obj.put("userName", user.getUserName());

        String authorizations = getAuthorization();

        try {
            URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("Authorization", authorizations);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);

            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(obj.toString().getBytes(StandardCharsets.UTF_8));
            }

            int code = connection.getResponseCode();
            InputStream responseStream = (code == 200) ? connection.getInputStream() : connection.getErrorStream();

            JSONParser parser = new JSONParser();
            JSONObject jsonObject = (JSONObject) parser.parse(new InputStreamReader(responseStream, StandardCharsets.UTF_8));

            log.info("Response={} ", jsonObject.toJSONString());
            log.info("status={}",code);
            return ResponseEntity.status(code).body(jsonObject);

        } catch (IOException | org.json.simple.parser.ParseException e) {
            log.error("Error during payment processing", e);
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("error", "Payment processing failed");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/payComplete")
    public ResponseEntity<Appointment> completeMatch(@SessionAttribute(name="user")User user, @RequestBody Appointment appointment)
    {
        log.info("결제 완료 후 request로 받은 Appointment = {}", appointment);
        if(user.getUserType()== UserType.COMPANION){
            appointment.setCompanionId(user.getId());
        }else if(user.getUserType()==UserType.WHEELCHAIR) {
            appointment.setWheelchairId(user.getId());
        }
        Appointment appliedAppointment = matchService.applyAppointment(appointment, user);
        log.info("DB에 등록된 Appointment = {}", appliedAppointment);
        return ResponseEntity.ok().body(appliedAppointment);
    }

    @GetMapping("/cancel")
    public ResponseEntity<Appointment> matchingCancel(@SessionAttribute(name="user")User user,@RequestParam("id")int id)
    {
        Appointment appointment = matchService.cancelAppointment(id);
        return ResponseEntity.ok().body(appointment);
    }

    @PostMapping("/review")
    public ResponseEntity<Appointment>registerReview(@RequestBody Appointment appointment){
        log.info("리뷰 등록된 매칭기록={}",appointment.toString());
        Appointment updateAppointment = matchService.updateAppointment(appointment);
        userService.updateRate(appointment);
        return ResponseEntity.ok().body(updateAppointment);
    }

    private String getAuthorization()
    {
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        return "Basic " + new String(encodedBytes);
    }


}
