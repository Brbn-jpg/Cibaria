package com.kk.cibaria.user;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

  @PutMapping("/users/{id}")
  public UserEntity update(@PathVariable int id, @RequestBody UserEntity user) {
    return userService.update(id, user);
  }

  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.delete(id);
  }

}
