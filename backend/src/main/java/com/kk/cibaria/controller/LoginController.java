package com.kk.cibaria.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kk.cibaria.exception.UserNotFoundException;
import com.kk.cibaria.service.UserDetailService;
import com.kk.cibaria.webtoken.JwtService;
import com.kk.cibaria.webtoken.LoginForm;

@RestController
public class LoginController {

  private AuthenticationManager authenticationManager;
  private JwtService jwtService;
  private UserDetailService userDetailService;

  public LoginController(AuthenticationManager authenticationManager, JwtService jwtService,
      UserDetailService userDetailService) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userDetailService = userDetailService;
  }

  @PostMapping("/authenticate")
  public String authenticate(@RequestBody LoginForm loginForm) {

    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginForm.username(), loginForm.password()));

    if (authentication.isAuthenticated()) {
      return jwtService.generateToken(userDetailService.loadUserByUsername(loginForm.username()));
    } else {
      throw new UserNotFoundException("Invalid credentials");
    }
  }

}
