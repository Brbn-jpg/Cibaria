package com.kk.cibaria.service;

import java.util.List;

import com.kk.cibaria.model.User;

public interface UserService {
  public List<User> getAll();

  public User getById(int id);

  public User save(User user);

  public User update(int id, User user);

  public void delete(int id);

}
