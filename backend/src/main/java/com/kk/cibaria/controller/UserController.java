package com.kk.cibaria.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kk.cibaria.model.UserEntity;
import com.kk.cibaria.service.UserService;

@RestController
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/users")
  public List<UserEntity> getAll() {
    return userService.getAll();
  }

  @GetMapping("/users/{id}")
  public UserEntity getById(@PathVariable int id) {
    return userService.getById(id);
  }

  @PostMapping("/users")
  public UserEntity save(@RequestBody UserEntity user) {
    return userService.save(user);
  }

  @PutMapping("/users/{id}")
  public UserEntity update(@PathVariable int id, @RequestBody UserEntity user) {
    return userService.update(id, user);
  }

  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.delete(id);
  }

}
