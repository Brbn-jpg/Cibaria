package com.kk.cibaria.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kk.cibaria.exception.UserNotFoundException;
import com.kk.cibaria.security.UserDetailService;
import com.kk.cibaria.security.jwt.JwtService;
import com.kk.cibaria.dto.LoginFormDto;

@RestController
public class LoginController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserDetailService userDetailService;

  public LoginController(AuthenticationManager authenticationManager, JwtService jwtService,
      UserDetailService userDetailService) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userDetailService = userDetailService;
  }

  @PostMapping("/authenticate")
  public String authenticate(@RequestBody LoginFormDto loginFormDto) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginFormDto.username(), loginFormDto.password()));

    if (authentication.isAuthenticated()) {
      return jwtService.generateToken(userDetailService.loadUserByUsername(loginFormDto.username()));
    } else {
      throw new UserNotFoundException("Invalid credentials");
    }
  }

}
