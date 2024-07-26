package cosmica.SpringServer.controller;


import cosmica.SpringServer.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
//동행자 매칭 관련 컨트롤러
public class CompanionController {

    private final UserService userService;




}
