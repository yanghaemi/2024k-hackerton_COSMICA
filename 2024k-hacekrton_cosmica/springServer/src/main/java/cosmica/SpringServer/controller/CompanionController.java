package cosmica.SpringServer.controller;


import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
//동행자 매칭 관련 컨트롤러
public class CompanionController {

    private final UserService userService;

    @PostMapping("/users/sign-up")
    public ResponseEntity<User> regiser(@RequestBody User user)
    {
        Optional<User> register = userService.register(user);
        ResponseEntity<User> response;
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        response = new ResponseEntity<User>(register.get(),headers,HttpStatus.OK);
        return response;
    }


    @PostMapping("/users/login")
    public ResponseEntity<User> login(@RequestParam("id")int id, @RequestParam("password")int password, Session session)
    {
        
    }

    @PostMapping("/Appointments/dateSearch")
    public ResponseEntity<List<User>> dateSearch(@RequestBody User user)
    {
        Optional<List<User>> byDate = userService.findByDate(user.getPossibleDate());
        ResponseEntity<List<User>> response;
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        response = new ResponseEntity<List<User>>(byDate.get(),headers,HttpStatus.OK);
        return response;
    }








}
