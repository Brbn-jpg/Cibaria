package com.kk.cibaria.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kk.cibaria.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

}
