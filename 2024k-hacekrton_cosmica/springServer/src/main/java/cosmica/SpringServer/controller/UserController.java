package cosmica.SpringServer.controller;

import cosmica.SpringServer.dto.forMapping.LoginRequest;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user)
    {
        log.info(user.toString());
        Optional<User> register = userService.register(user);
        ResponseEntity<User> response;
        response = new ResponseEntity<User>(register.get(),getJSONHeader(), HttpStatus.OK);
        return response;
    }


    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest, HttpSession session)
    {
        log.debug(loginRequest.toString());
        Optional<User> login = userService.login(Integer.parseInt(loginRequest.getId()), loginRequest.getPassword());
        if(login.isPresent())
        {
            session.setAttribute("user", login.get());
            ResponseEntity<User> response;
            response = new ResponseEntity<User>(login.get(),getJSONHeader(),HttpStatus.OK);
            return response;
        }
        return ResponseEntity.of(login);
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/findById")
    public ResponseEntity<User> findById(@RequestParam(value = "id")String id) {
        log.info(id);
        int id1 = Integer.parseInt(id);
        Optional<User> user = userService.findById(id1);
        System.out.println(user.get());
        return ResponseEntity.of(user);
    }

    @PostMapping("/myInfo")
    public ResponseEntity<User> getMyInfo(@SessionAttribute(name="user", required=false) User user) {
        if (user == null) {
            log.info("로그인 안됨= {}",user);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("나의 정보: {}", user.toString());
        return ResponseEntity.ok().body(user);
    }


    private HttpHeaders getJSONHeader()
    {
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        return headers;
    }
}
