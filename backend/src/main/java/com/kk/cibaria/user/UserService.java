package com.kk.cibaria.user;

import java.util.List;

import com.kk.cibaria.dto.auth.RegisterDto;
import com.kk.cibaria.dto.auth.TokenResponseDto;

public interface UserService {
  public List<UserEntity> getAll();

  public UserEntity getById(int id);

  public TokenResponseDto save(RegisterDto user);

  public UserEntity update(int id, UserEntity user);

  public void delete(int id);

}
