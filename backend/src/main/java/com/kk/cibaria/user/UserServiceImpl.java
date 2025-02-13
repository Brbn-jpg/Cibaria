package com.kk.cibaria.user;

import java.util.List;
import java.util.Optional;

import com.kk.cibaria.dto.auth.RegisterDto;
import com.kk.cibaria.dto.auth.TokenResponseDto;
import com.kk.cibaria.exception.UserEmailAlreadyExistException;
import com.kk.cibaria.security.UserDetailService;
import com.kk.cibaria.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kk.cibaria.exception.UserNotFoundException;
import com.kk.cibaria.Recipe.Rating;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserDetailService userDetailService;

  public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, UserDetailService userDetailService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
      this.jwtService = jwtService;
      this.userDetailService = userDetailService;
  }

  @Override
  public List<UserEntity> getAll() {
    return userRepository.findAll();
  }

  @Override
  public UserEntity getById(int id) {
    return userRepository.findById(id).orElseThrow(
        () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));
  }

  @Override
  public TokenResponseDto save(RegisterDto dto) {
    Optional<UserEntity> isUser = userRepository.findByEmail(dto.getEmail());
    if(isUser.isPresent()){
      throw new UserEmailAlreadyExistException("User with given email: " + dto.getEmail() + " already exist in database");
    }
    UserEntity newUser = new UserEntity();
    newUser.setEmail(dto.getEmail());
    newUser.setPassword(passwordEncoder.encode(dto.getPassword()));
    newUser.setUsername(dto.getUsername());

    UserEntity userDb = userRepository.save(newUser);
    TokenResponseDto token = new TokenResponseDto();
    token.setToken(jwtService.generateToken(userDetailService.loadUserByUsername(userDb.getEmail())));
    return token;
  }

  @Override
  public UserEntity update(int id, UserEntity user) {
    UserEntity userFound = userRepository.findById(id)
        .orElseThrow(
            () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    userFound.setId(id);
    userFound.setUsername(user.getUsername());
    userFound.setPassword(user.getPassword());
    userFound.setEmail(user.getEmail());
    userFound.getRating().clear();

    for (Rating rating : user.getRating()) {
      rating.setUser(userFound);
      userFound.getRating().add(rating);
    }

    return userRepository.save(userFound);
  }

  @Override
  public void delete(int id) {
    UserEntity user = userRepository.findById(id).orElseThrow(
        () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    userRepository.delete(user);
  }

}
