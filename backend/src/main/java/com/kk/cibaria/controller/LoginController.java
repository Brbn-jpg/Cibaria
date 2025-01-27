package com.kk.cibaria.controller;

import com.kk.cibaria.dto.TokenResponseDto;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
  public TokenResponseDto authenticate(@RequestBody LoginFormDto loginFormDto) {
    try{
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginFormDto.username(), loginFormDto.password()));
      TokenResponseDto token = new TokenResponseDto();
      token.setToken(jwtService.generateToken(userDetailService.loadUserByUsername(loginFormDto.username())));
      return token;
    }catch (BadCredentialsException ex) {
      throw new UserNotFoundException("Invalid credentials");
    }
  }
}
