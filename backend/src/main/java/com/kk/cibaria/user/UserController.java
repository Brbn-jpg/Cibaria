package com.kk.cibaria.user;

import java.io.IOException;
import java.util.List;

import com.kk.cibaria.dto.myProfile.MyProfileDto;
import com.kk.cibaria.dto.myProfile.UpdateEmailDto;
import com.kk.cibaria.dto.myProfile.UpdatePasswordDto;

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
  public UserEntity update(@PathVariable int id, @RequestBody UserEntity user, @RequestHeader("Authorization") String token) {
    return userService.update(id, user);
  }

  @PutMapping("/{id}/profile")
  public UserEntity updateProfile(@PathVariable int id, @RequestBody MyProfileDto profileDto, @RequestHeader("Authorization") String token) {
    return userService.updateProfile(id, profileDto, token);
  }

  @PutMapping("/{id}/email")
  public UserEntity updateEmail(@PathVariable int id, @RequestBody UpdateEmailDto updateEmailDto, @RequestHeader("Authorization") String token) {
    return userService.updateEmail(id, updateEmailDto, token);
  } 

  @PutMapping("/{id}/password")
  public UserEntity updatePassword(@PathVariable int id, @RequestBody UpdatePasswordDto updatePasswordDto, @RequestHeader("Authorization") String token) {
    return userService.updatePassword(id, updatePasswordDto, token);
  }

  @GetMapping("/aboutme")
  public MyProfileDto getMyProfile(@RequestHeader("Authorization") String token){
    return userService.getMyProfile(token);
  }

  @GetMapping("/recipes")
  public MyProfileDto getUserRecipes(@RequestHeader("Authorization") String token){
    return userService.getUserRecipes(token);
  }

  @GetMapping("/favourites")
  public MyProfileDto getFavouriteRecipes(@RequestHeader("Authorization") String token){
    return userService.getFavouriteRecipes(token);
  }
  

  @PutMapping("/{userId}/profile-picture")
    public ResponseEntity<String> updateProfilePicture(
            @PathVariable int userId,
            @RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) throws IOException {
        
        String imageUrl = userService.updateProfilePicture(userId, file, token);
        return ResponseEntity.ok(imageUrl);
    }

    @PutMapping("/{userId}/background-picture")
    public ResponseEntity<String> updateBackgroundPicture(
            @PathVariable int userId,
            @RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) throws IOException {
        
        String imageUrl = userService.updateBackgroundPicture(userId, file, token);
        return ResponseEntity.ok(imageUrl);
    }

  @DeleteMapping("/users/{id}")
  public void delete(@PathVariable int id) {
    userService.delete(id);
  }

}
