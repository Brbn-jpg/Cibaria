package com.kk.cibaria.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kk.cibaria.exception.UserNotFoundException;
import com.kk.cibaria.model.Rating;
import com.kk.cibaria.model.UserEntity;
import com.kk.cibaria.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public List<UserEntity> getAll() {
    return userRepository.findAll();
  }

  @Override
  public UserEntity getById(int id) {
    return userRepository.findById(id).orElseThrow(
        () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));
  }

  @Override
  public UserEntity save(UserEntity user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    UserEntity userdb = userRepository.save(user);
    return userdb;
  }

  @Override
  public UserEntity update(int id, UserEntity user) {
    UserEntity userFound = userRepository.findById(id)
        .orElseThrow(
            () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    userFound.setId(id);
    userFound.setUsername(user.getUsername());
    userFound.setPassword(user.getPassword());
    userFound.setEmail(user.getEmail());
    userFound.getRating().clear();

    for (Rating rating : user.getRating()) {
      rating.setUser(userFound);
      userFound.getRating().add(rating);
    }

    return userRepository.save(userFound);
  }

  @Override
  public void delete(int id) {
    UserEntity user = userRepository.findById(id).orElseThrow(
        () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    userRepository.delete(user);
  }

}
