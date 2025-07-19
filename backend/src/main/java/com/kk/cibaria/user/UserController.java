package com.kk.cibaria.user;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.myProfile.MyProfileDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

  @PutMapping("/{userId}/profile-picture")
    public ResponseEntity<String> updateProfilePicture(
            @PathVariable int userId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = userService.updateProfilePicture(userId, file);
        return ResponseEntity.ok(imageUrl);
    }

    @PutMapping("/{userId}/background-picture")
    public ResponseEntity<String> updateBackgroundPicture(
            @PathVariable int userId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String imageUrl = userService.updateBackgroundPicture(userId, file);
        return ResponseEntity.ok(imageUrl);
    }

  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.delete(id);
  }

}
