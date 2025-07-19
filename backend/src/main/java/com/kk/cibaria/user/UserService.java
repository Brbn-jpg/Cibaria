package com.kk.cibaria.user;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kk.cibaria.dto.auth.RegisterDto;
import com.kk.cibaria.dto.auth.TokenResponseDto;
import com.kk.cibaria.dto.myProfile.MyProfileDto;

public interface UserService {
   List<UserEntity> getAll();

   UserEntity getById(int id);

   TokenResponseDto save(RegisterDto user);

   UserEntity update(int id, UserEntity user);

   void delete(int id);

   MyProfileDto getMyProfile(String token);

   String updateProfilePicture(int userId, MultipartFile file) throws IOException;
   
   String updateBackgroundPicture(int userId, MultipartFile file) throws IOException;
}
