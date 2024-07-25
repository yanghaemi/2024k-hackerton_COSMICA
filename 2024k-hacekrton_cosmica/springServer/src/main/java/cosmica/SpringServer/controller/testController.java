package cosmica.SpringServer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import cosmica.SpringServer.dto.User;

@RestController
public class testController {

    List<User> list = new ArrayList<>();

    @GetMapping("users")
    List<User>getUsers()
    {
        return list;
    }

    @PostMapping("verify")
    User createUser(@RequestBody User user)
    {
        System.out.println(user);
        list.add(user);
        return user;
    }



}
