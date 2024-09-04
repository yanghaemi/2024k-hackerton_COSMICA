package cosmica.SpringServer.controller;

import cosmica.SpringServer.dto.forMapping.LoginRequest;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
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
    public ResponseEntity<String> logout(HttpSession session) {
        // 세션 무효화
        session.removeAttribute("user");
        session.invalidate();
        // 로그 출력
        log.info("Session invalidated: {}", session);
        // 클라이언트에 로그아웃 성공 메시지와 상태 코드 반환
        return ResponseEntity.ok("Logout successful");
    }


    @PostMapping("/findById")
    public ResponseEntity<User> findById(@RequestParam(value = "id") String id) {
        log.info("Received ID: " + id);
        if(id.equals("0")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        int id1 = Integer.parseInt(id);
        try {
            Optional<User> user = userService.findById(id1);
            return ResponseEntity.ok(user.get());
        }
        catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostMapping("/myInfo")
    public ResponseEntity<User> getMyInfo(@SessionAttribute(name="user", required=false) User user) {
        log.info("abc");
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
