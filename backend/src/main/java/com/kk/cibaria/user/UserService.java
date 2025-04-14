package com.kk.cibaria.user;

import java.util.List;

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

}
