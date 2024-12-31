package com.kk.cibaria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.kk.cibaria.service.UserDetailService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  private UserDetailService userDetailService;

  private JwtAuthenticationFilter authenticationFilter;

  public SecurityConfiguration(UserDetailService userDetailService, JwtAuthenticationFilter authenticationFilter) {
    this.userDetailService = userDetailService;
    this.authenticationFilter = authenticationFilter;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(req -> {
      req.requestMatchers(HttpMethod.POST, "/users", "/authenticate").permitAll();
      req.requestMatchers(HttpMethod.GET, "/recipes/**").permitAll();
      req.requestMatchers(HttpMethod.POST, "/recipes").hasRole("ADMIN");
      req.requestMatchers(HttpMethod.DELETE, "/recipes").hasRole("ADMIN");
      req.anyRequest().authenticated();
    });

    http.csrf(csrf -> csrf.disable());
    http.httpBasic(Customizer.withDefaults());
    http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder());
    provider.setUserDetailsService(userDetailService);
    return provider;
  }

  @Bean
  public AuthenticationManager authenticationManager() {
    return new ProviderManager(authenticationProvider());
  }

}
