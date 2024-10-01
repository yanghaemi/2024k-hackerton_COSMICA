package cosmica.SpringServer.controller;

import cosmica.SpringServer.dto.forMapping.LoginRequest;
import cosmica.SpringServer.dto.User;
import cosmica.SpringServer.enums.UserType;
import cosmica.SpringServer.service.user.UserService;
import cosmica.SpringServer.service.verify.VerifyService;
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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
public class UserController {

    private final UserService userService;
    private final VerifyService verifyService;

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

    @PostMapping("/verify")
    public ResponseEntity<User> getVerify(@SessionAttribute(name="user", required=false) User user,
                                          @RequestParam("file") MultipartFile file) throws IOException {
        if(file.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        try {
            Path upload = verifyService.upload(file);
            log.info("upload path={}",upload.toString());
            user.setVerifyFilePath(upload.toString());
            log.info("user verify path={}",user.getVerifyFilePath());
            userService.updateUser(user);
        }catch (IOException e) {
            log.error("파일 저장 중 오류 발생", e);  // 예외 로그 출력
            throw new RuntimeException("파일 저장 중 오류 발생", e); // 적절한 예외 처리
        }

        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/verify")
    public String setVerify(Model model) {
        log.info("verify page");
        List<User> userList = userService.findAll();
        List<User> filteredUser = userList.stream()
                .filter(user -> !user.getVerify() && user.getVerifyFilePath() != null)
                .map(user -> {
                    // 파일 경로를 상대 경로로 변경 (예: "/VerifyFiles/file.pdf")
                    String relativePath = "/VerifyFiles/" + Paths.get(user.getVerifyFilePath()).getFileName();
                    log.info(relativePath);
                    user.setVerifyFilePath(relativePath);
                    return user;
                })
                .toList();
        log.info(filteredUser.toString());
        model.addAttribute("userList", filteredUser);
        return "VerifyUser";
    }

    @GetMapping("/verify/confirm")
    public String setVerifyConfirm(@RequestParam("id") String id) {
        Optional<User> user = userService.findById(Integer.parseInt(id));
        user.ifPresent(user1 -> {
            user1.setVerify(true);
            userService.updateUser(user1);
        });
        log.info("verified user = {}", user.toString());
        return "redirect:/users/verify";
    }

    @GetMapping("/verify/refuse")
    public String setVerifyRefuse(@RequestParam("id") String id) {
        return "redirect:/users/verify";
    }


    private HttpHeaders getJSONHeader()
    {
        HttpHeaders headers = new HttpHeaders();
        MediaType mediaType = new MediaType("application", "json");
        headers.setContentType(mediaType);
        return headers;
    }
}
