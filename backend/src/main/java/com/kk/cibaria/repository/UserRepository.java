package com.kk.cibaria.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kk.cibaria.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
  Optional<UserEntity> findByUsername(String username);
}
