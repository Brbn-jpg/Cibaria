package com.kk.cibaria.service;

import java.util.List;

import com.kk.cibaria.dto.RegisterDto;
import com.kk.cibaria.model.UserEntity;

public interface UserService {
  public List<UserEntity> getAll();

  public UserEntity getById(int id);

  public String save(RegisterDto user);

  public UserEntity update(int id, UserEntity user);

  public void delete(int id);

}
