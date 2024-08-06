package cosmica.SpringServer.controller;


import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.dto.forMapping.DateMapping;
import cosmica.SpringServer.service.match.MatchService;
import jakarta.servlet.http.HttpSession;
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
import java.text.SimpleDateFormat;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/appointment")
@Slf4j
//동행자 매칭 관련 컨트롤러
public class AppointmentController {

    private final MatchService matchService;

    @PostMapping("/register")
    public ResponseEntity<Map<Date,Appointment>> dateRegister(@SessionAttribute(name="user")User user, @RequestBody Appointment appointment)
    {
        log.info(user.toString());
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

    @GetMapping("/my")
    public ResponseEntity<List<Appointment>> lookupMyAppointment(@SessionAttribute(name="user")User user)
    {
        List<Appointment> appointments = matchService.searchAppointmentByUser(user);
        return ResponseEntity.ok().body(appointments);
    }


    @PostMapping("/pay")
    public ResponseEntity<JSONObject> payMatch(@RequestBody String jsonBody, @SessionAttribute(name="user")User user) throws IOException, ParseException, org.json.simple.parser.ParseException {

        log.info(jsonBody);
        JSONParser parser = new JSONParser();
        String orderId;
        String amount;
        String paymentKey;
        // 클라이언트에서 받은 JSON 요청 바디입니다.
        JSONObject requestData = (JSONObject) parser.parse(jsonBody);
        paymentKey = (String) requestData.get("paymentKey");
        orderId = (String) requestData.get("orderId");
        amount = (String) requestData.get("amount");
        ;
        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        //결제 승인 api 권한 코드
        String authorizations = getAuthorization();


        // 결제 승인 API설정과 API로 데이터를 보낼 방식 설정.
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        //보낼 데이터 입력
        OutputStream outputStream = connection.getOutputStream();
        //데이터 전송
        outputStream.write(obj.toString().getBytes("UTF-8"));


        //응답 코드 확인.
        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        // TODO: 결제 성공 및 실패 비즈니스 로직을 구현하세요.
        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);
        log.info(jsonBody);
        responseStream.close();
        return ResponseEntity.status(code).body(jsonObject);
    }

    @PostMapping("/payComplete")
    public ResponseEntity<Appointment> completeMatch(@SessionAttribute(name="user")User user, @RequestBody Appointment appointment)
    {
        Appointment appliedAppointment = matchService.applyAppointment(appointment, user);
        return ResponseEntity.ok().body(appliedAppointment);
    }

    @GetMapping("/cancel")
    public ResponseEntity<Appointment> matchingCancel(@SessionAttribute(name="user")User user,@RequestParam("id")int id)
    {
        Appointment appointment = matchService.cancelAppointment(id);
        return ResponseEntity.ok().body(appointment);
    }


    private String getAuthorization()
    {
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        return "Basic " + new String(encodedBytes);
    }


}
