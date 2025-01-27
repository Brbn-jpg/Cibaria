package com.kk.cibaria.controller;

import com.kk.cibaria.dto.RegisterDto;
import com.kk.cibaria.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {
    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String RegisterUser(@RequestBody RegisterDto dto) {
        return userService.save(dto);
    }
}
