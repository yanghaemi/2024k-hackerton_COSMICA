package cosmica.SpringServer.controller;


import cosmica.SpringServer.dto.Appointment;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.match.MatchService;
import cosmica.SpringServer.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

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
//동행자 매칭 관련 컨트롤러
public class CompanionController {

    private final UserService userService;
    private final MatchService matchService;

    private HttpHeaders getJSONHeader()
    {
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        return headers;
    }

    @GetMapping("/test")
    public Appointment test()
    {
        Appointment appointment = new Appointment();
        Date date = new Date(System.currentTimeMillis());
        appointment.setId(1);
        appointment.setCompanionId(12);
        appointment.setWheelchairId(13);
        appointment.setAppointDate(date);
        appointment.setBill(14);
        System.out.println(appointment);
        return appointment;
    }

    @PostMapping("/users/sign-up")
    public ResponseEntity<User> register(@RequestBody User user)
    {
        System.out.println(user);
        if(user.getUserType()==UserType.WHEELCHAIR)
        {
            System.out.println("abc");
            System.out.println(user.getUserType().toString());
        }
        Optional<User> register = userService.register(user);
        ResponseEntity<User> response;
        response = new ResponseEntity<User>(register.get(),getJSONHeader(),HttpStatus.OK);
        return response;
    }


    @PostMapping("/users/login")
    public ResponseEntity<User> login(@RequestParam("id")int id,@RequestParam("password")String pw, HttpSession session)
    {
        System.out.println(id+" "+pw);
        Optional<User> login = userService.login(id,pw);
        if(login.isPresent())
        {
            System.out.println(login.get());
            session.setAttribute("user", login.get());
            ResponseEntity<User> response;
            HttpHeaders headers = new HttpHeaders();
            MediaType mediaType = new MediaType("application","json");
            headers.setContentType(mediaType);
            response = new ResponseEntity<User>(login.get(),headers,HttpStatus.OK);
            return response;
        }
        return ResponseEntity.of(login);
    }

    @GetMapping("/users/logout")
    public ResponseEntity<User> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/dateRegister")
    public ResponseEntity<Map<Date,Appointment>> dateRegister(@SessionAttribute(name="user")User user, @RequestBody Appointment appointment, HttpSession session)
    {
        System.out.println(user);
        System.out.println(appointment);
        Appointment registeredAppointment = matchService.registerAppointment(user, appointment);
        Map<Date,Appointment> mapAppointment = new HashMap<Date,Appointment>();
        mapAppointment.put(registeredAppointment.getAppointDate(),registeredAppointment);
        return ResponseEntity.ok().body(mapAppointment);
    }

    @GetMapping("/dateSearch")
    public ResponseEntity<List<Appointment>> dateSearch(@RequestBody Date date)
    {
        List<Appointment> appointments = matchService.searchAppointmentByDate(date);
        return ResponseEntity.ok().body(appointments);
    }

    @GetMapping("/lookupMyAppointment")
    public ResponseEntity<List<Appointment>> lookupMyAppointment(HttpSession session,@SessionAttribute(name="user")User user)
    {
        List<Appointment> appointments = matchService.searchAppointmentByUser(user);
        return ResponseEntity.ok().body(appointments);
    }


    @PostMapping("/matchDecide")
    public ResponseEntity<JSONObject> matchDecide(@RequestBody String jsonBody, HttpSession session, @SessionAttribute(name="user")User user) throws IOException, ParseException, org.json.simple.parser.ParseException {

        System.out.println(jsonBody);
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
        System.out.println(jsonObject);
        responseStream.close();
        return ResponseEntity.status(code).body(jsonObject);
    }

    @PostMapping("/matching")
    public ResponseEntity<Appointment> matching(@SessionAttribute(name="user")User user,@RequestBody Appointment appointment)
    {
        Appointment appliedAppointment = matchService.applyAppointment(appointment, user);
        return ResponseEntity.ok().body(appliedAppointment);
    }

    @GetMapping("/matchingCancel")
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
