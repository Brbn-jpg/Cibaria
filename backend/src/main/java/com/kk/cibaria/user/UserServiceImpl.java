package com.kk.cibaria.user;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.kk.cibaria.recipe.Recipe;
import com.kk.cibaria.dto.auth.RegisterDto;
import com.kk.cibaria.dto.auth.TokenResponseDto;
import com.kk.cibaria.dto.myProfile.MyProfileDto;
import com.kk.cibaria.dto.myProfile.MyProfileRecipeDto;
import com.kk.cibaria.exception.UnauthorizedException;
import com.kk.cibaria.exception.UserEmailAlreadyExistException;
import com.kk.cibaria.security.UserDetailService;
import com.kk.cibaria.security.jwt.JwtService;
import com.kk.cibaria.cloudinary.CloudinaryService;

import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kk.cibaria.exception.UserNotFoundException;
import com.kk.cibaria.image.Image;
import com.kk.cibaria.image.ImageService;
import com.kk.cibaria.image.ImageRepository;
import com.kk.cibaria.image.ImageType;
import com.kk.cibaria.rating.Rating;

@Service
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserDetailService userDetailService;
  private final ImageService imageService;
  private final CloudinaryService cloudinaryService;
  private final ImageRepository imageRepository;

  public UserServiceImpl(UserRepository userRepository, 
                        PasswordEncoder passwordEncoder, 
                        JwtService jwtService, 
                        UserDetailService userDetailService, 
                        ImageService imageService,
                        CloudinaryService cloudinaryService,
                        ImageRepository imageRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.userDetailService = userDetailService;
    this.imageService = imageService;
    this.cloudinaryService = cloudinaryService;
    this.imageRepository = imageRepository;
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

    userFound.setId(id); // probably unnecessary, but keeping for now
    userFound.setUsername(user.getUsername());
    userFound.setDescription(user.getDescription());
    userFound.setPassword(user.getPassword());
    userFound.setEmail(user.getEmail());
    userFound.getRating().clear(); // probably unnecessary as well, but keeping for now might make a separate method for this

    for (Rating rating : user.getRating()) {
      rating.setUser(userFound);
      userFound.getRating().add(rating);
    }

    return userRepository.save(userFound);
  }

  @Override
  public UserEntity updateProfile(int id, MyProfileDto profileDto, String token) {
    MyProfileDto currentUser = getMyProfile(token);
    if (currentUser.getId() != id) {
        throw new UnauthorizedException("You can only update your own profile");
    }

    UserEntity userFound = userRepository.findById(id)
        .orElseThrow(
            () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    if (profileDto.getUsername() != null && !profileDto.getUsername().isEmpty()) {
        userFound.setUsername(profileDto.getUsername());
    }
    if (profileDto.getDescription() != null) {
        userFound.setDescription(profileDto.getDescription());
    }
    return userRepository.save(userFound);
  }

  @Override
  @Transactional
  public String updateProfilePicture(int userId, MultipartFile file, String token) throws IOException {

    MyProfileDto currentUser = getMyProfile(token);
    if (currentUser.getId() != userId) {
        throw new UnauthorizedException("You can only update your own profile picture");
    }

    UserEntity user = userRepository.findById(userId).orElseThrow(
      () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", userId)));

    deleteExistingImage(user, ImageType.PROFILE_PICTURE);
    
    Image image = createUserImage(file, user, ImageType.PROFILE_PICTURE);
    return image.getImageUrl();
  }

  @Override
  @Transactional
  public String updateBackgroundPicture(int userId, MultipartFile file, String token) throws IOException {
    MyProfileDto currentUser = getMyProfile(token);
    if (currentUser.getId() != userId) {
        throw new UnauthorizedException("You can only update your own profile picture");
    }

    UserEntity user = userRepository.findById(userId).orElseThrow(
      () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", userId)));

    deleteExistingImage(user, ImageType.BACKGROUND_PICTURE);
    
    Image image = createUserImage(file, user, ImageType.BACKGROUND_PICTURE);
    return image.getImageUrl();
  }

  @Override
  public void delete(int id) {
    UserEntity user = userRepository.findById(id).orElseThrow(
        () -> new UserNotFoundException(String.format("User with id: %s does not exist in the database", id)));

    userRepository.delete(user);
  }

  // Helper methods
  public String getProfilePicture(UserEntity user) {
    return user.getImages().stream()
      .filter(image -> image.getImageType() == ImageType.PROFILE_PICTURE)
      .findFirst()
      .map(Image::getImageUrl)
      .orElse(null);
  }

  public String getBackgroundPicture(UserEntity user) {
    return user.getImages().stream()
      .filter(image -> image.getImageType() == ImageType.BACKGROUND_PICTURE)
      .findFirst()
      .map(Image::getImageUrl)
      .orElse(null);
  }

  private void deleteExistingImage(UserEntity user, ImageType imageType) {
    List<Image> imagesToDelete = user.getImages().stream()
        .filter(img -> img.getImageType() == imageType)
        .collect(Collectors.toList());
    
    for (Image img : imagesToDelete) {
        try {
            cloudinaryService.removePhoto(img.getPublicId());
            imageRepository.deleteById(img.getId());
            user.getImages().remove(img);
        } catch (Exception e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }
}

  private Image createUserImage(MultipartFile file, UserEntity user, ImageType imageType) throws IOException {
    Image image = imageService.createPhoto(file, imageType);
    
    image.setUser(user);
    image.setImageType(imageType);
    Image savedImage = imageRepository.save(image);

    user.getImages().add(savedImage);
    userRepository.save(user);
  
    return savedImage;
  }

  @Override
  public MyProfileDto getMyProfile(String token) {
    int userId = jwtService.extractId(token.substring(7));
    UserEntity user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException("User not found"));

    MyProfileDto myProfileDto = new MyProfileDto();
    myProfileDto.setId(user.getId());
    myProfileDto.setPhotoUrl(getProfilePicture(user));
    myProfileDto.setBackgroundUrl(getBackgroundPicture(user));
    myProfileDto.setUsername(user.getUsername());
    myProfileDto.setDescription(user.getDescription());

    List<Recipe> favouriteRecipes = user.getFavouriteRecipes();
    if(!favouriteRecipes.isEmpty()){
      List<MyProfileRecipeDto> recipeDtos = favouriteRecipes.stream().map(recipe -> {
        MyProfileRecipeDto dto = new MyProfileRecipeDto();
        dto.setId(recipe.getId());
        dto.setImageUrl(recipe.getImages());
        dto.setRecipeName(recipe.getRecipeName());
        dto.setCategory(recipe.getCategory());
        dto.setServings(recipe.getServings());
        dto.setDifficulty(recipe.getDifficulty());
        dto.setPrepareTime(recipe.getPrepareTime());

        int ratings = recipe.getRatings().size();
        if(ratings > 0){
          int ratingSum = recipe.getRatings().stream().mapToInt(Rating::getValue).sum();
          Long averageRating = (long) (ratingSum / ratings);
          dto.setAvgRating(averageRating);
        } else {
          dto.setAvgRating(0L);
        }
        return dto;
      }).toList();
      myProfileDto.setFavourites(recipeDtos);
    } else {
      myProfileDto.setFavourites(null);
    }
    return myProfileDto;
  }
}