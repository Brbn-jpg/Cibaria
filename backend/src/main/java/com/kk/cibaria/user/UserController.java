package com.kk.cibaria.user;

import java.util.List;

import com.kk.cibaria.dto.myProfile.MyProfileDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<UserEntity> getAll() {
    return userService.getAll();
  }

  @GetMapping("/{id}")
  public UserEntity getById(@PathVariable int id) {
    return userService.getById(id);
  }

  @PutMapping("/{id}")
  public UserEntity update(@PathVariable int id, @RequestBody UserEntity user) {
    return userService.update(id, user);
  }

  @GetMapping("/aboutme")
  public MyProfileDto getMyProfile(@RequestHeader("Authorization") String token){
    return userService.getMyProfile(token);
  }

  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.delete(id);
  }

}
