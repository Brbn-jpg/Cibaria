package com.kk.cibaria.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.kk.cibaria.model.UserEntity;
import com.kk.cibaria.repository.UserRepository;

@Service
public class UserDetailService implements UserDetailsService {

  private final UserRepository userRepository;

  public UserDetailService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Optional<UserEntity> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      var userObj = user.get();
      return User.builder()
          .username(userObj.getUsername())
          .password(userObj.getPassword())
          .roles(getRoles(userObj))
          .build();

    } else {
      throw new UsernameNotFoundException(username);
    }

  }

  private String[] getRoles(UserEntity userObj) {
    if (userObj.getRole().isEmpty()) {
      return new String[] { "USER" };
    } else {
      return userObj.getRole().split(",");
    }
  }

}
