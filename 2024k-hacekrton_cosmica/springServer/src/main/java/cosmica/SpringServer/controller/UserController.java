package cosmica.SpringServer.controller;

import cosmica.SpringServer.dto.LoginRequest;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/users/sign-up")
    public ResponseEntity<User> register(@RequestBody User user)
    {
        System.out.println(user);
        if(user.getUserType()== UserType.WHEELCHAIR)
        {
            System.out.println("abc");
            System.out.println(user.getUserType().toString());
        }
        Optional<User> register = userService.register(user);
        ResponseEntity<User> response;
        response = new ResponseEntity<User>(register.get(),getJSONHeader(), HttpStatus.OK);
        return response;
    }


    @PostMapping("/users/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest, HttpSession session)
    {
        System.out.println(loginRequest.getId()+" "+loginRequest.getPw());
        Optional<User> login = userService.login(loginRequest.getId(), loginRequest.getPw());
        if(login.isPresent())
        {
            System.out.println(login.get());
            session.setAttribute("user", login.get());
            ResponseEntity<User> response;
            response = new ResponseEntity<User>(login.get(),getJSONHeader(),HttpStatus.OK);
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

    private HttpHeaders getJSONHeader()
    {
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        return headers;
    }
}
