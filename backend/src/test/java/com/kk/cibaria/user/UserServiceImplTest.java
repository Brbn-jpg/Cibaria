package com.kk.cibaria.user;

import com.kk.cibaria.cloudinary.CloudinaryService;
import com.kk.cibaria.dto.auth.RegisterDto;
import com.kk.cibaria.dto.auth.TokenResponseDto;
import com.kk.cibaria.dto.myProfile.MyProfileDto;
import com.kk.cibaria.dto.myProfile.MyProfileRecipeDto;
import com.kk.cibaria.dto.myProfile.UpdateEmailDto;
import com.kk.cibaria.dto.myProfile.UpdatePasswordDto;
import com.kk.cibaria.exception.*;
import com.kk.cibaria.image.Image;
import com.kk.cibaria.image.ImageRepository;
import com.kk.cibaria.image.ImageService;
import com.kk.cibaria.image.ImageType;
import com.kk.cibaria.rating.Rating;
import com.kk.cibaria.recipe.Recipe;
import com.kk.cibaria.security.UserDetailService;
import com.kk.cibaria.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailService userDetailService;

    @Mock
    private ImageService imageService;

    @Mock
    private CloudinaryService cloudinaryService;

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserEntity testUser;
    private String testToken;

    @BeforeEach
    void setUp() {
        testUser = new UserEntity();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole("USER");
        testUser.setDescription("Test description");
        testUser.setRating(new ArrayList<>());
        testUser.setUserRecipes(new ArrayList<>());
        testUser.setFavouriteRecipes(new ArrayList<>());
        testUser.setImages(new ArrayList<>());

        testToken = "Bearer testtoken123";
    }

    @Test
    void testGetAll() {
        List<UserEntity> users = List.of(testUser);
        when(userRepository.findAll()).thenReturn(users);

        List<UserEntity> result = userService.getAll();

        assertEquals(1, result.size());
        assertEquals(testUser, result.get(0));
        verify(userRepository).findAll();
    }

    @Test
    void testGetById_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        UserEntity result = userService.getById(1);

        assertEquals(testUser, result);
        verify(userRepository).findById(1);
    }

    @Test
    void testGetById_UserNotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getById(1));
        verify(userRepository).findById(1);
    }

    @Test
    void testSave_Success() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setEmail("new@example.com");
        registerDto.setPassword("password123");
        registerDto.setUsername("newuser");

        UserDetails userDetails = mock(UserDetails.class);
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(testUser);
        when(userDetailService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("generatedToken");

        TokenResponseDto result = userService.save(registerDto);

        assertNotNull(result);
        assertEquals("generatedToken", result.getToken());
        verify(userRepository).findByEmail("new@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void testSave_EmailAlreadyExists() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setEmail("existing@example.com");

        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(UserEmailAlreadyExistException.class, () -> userService.save(registerDto));
        verify(userRepository).findByEmail("existing@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void testUpdate_Success() {
        UserEntity updatedUser = new UserEntity();
        updatedUser.setUsername("updateduser");
        updatedUser.setDescription("Updated description");
        updatedUser.setPassword("newPassword");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setRating(new ArrayList<>());

        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(UserEntity.class))).thenReturn(testUser);

        UserEntity result = userService.update(1, updatedUser);

        assertEquals(testUser, result);
        verify(userRepository).findById(1);
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateProfile_Success() {
        MyProfileDto profileDto = new MyProfileDto();
        profileDto.setUsername("updateduser");
        profileDto.setDescription("Updated description");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(testUser)).thenReturn(testUser);

        UserEntity result = userService.updateProfile(1, profileDto, testToken);

        assertEquals("updateduser", result.getUsername());
        assertEquals("Updated description", result.getDescription());
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateProfile_Unauthorized() {
        MyProfileDto profileDto = new MyProfileDto();
        
        when(jwtService.extractId("testtoken123")).thenReturn(2); // Different user ID
        when(userRepository.findById(2)).thenReturn(Optional.of(new UserEntity()));

        assertThrows(UnauthorizedException.class, 
            () -> userService.updateProfile(1, profileDto, testToken));
    }

    @Test
    void testUpdateEmail_Success() {
        UpdateEmailDto updateEmailDto = new UpdateEmailDto();
        updateEmailDto.setNewEmail("newemail@example.com");
        updateEmailDto.setPassword("password123");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(userRepository.findByEmail("newemail@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(testUser)).thenReturn(testUser);

        UserEntity result = userService.updateEmail(1, updateEmailDto, testToken);

        assertEquals("newemail@example.com", result.getEmail());
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateEmail_InvalidFormat() {
        UpdateEmailDto updateEmailDto = new UpdateEmailDto();
        updateEmailDto.setNewEmail("invalid-email");
        updateEmailDto.setPassword("password123");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        assertThrows(InvalidEmailFormatException.class, 
            () -> userService.updateEmail(1, updateEmailDto, testToken));
    }

    @Test
    void testUpdateEmail_WrongPassword() {
        UpdateEmailDto updateEmailDto = new UpdateEmailDto();
        updateEmailDto.setNewEmail("newemail@example.com");
        updateEmailDto.setPassword("wrongpassword");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        assertThrows(InvalidPasswordException.class, 
            () -> userService.updateEmail(1, updateEmailDto, testToken));
    }

    @Test
    void testUpdatePassword_Success() {
        UpdatePasswordDto updatePasswordDto = new UpdatePasswordDto();
        updatePasswordDto.setCurrentPassword("currentPassword");
        updatePasswordDto.setNewPassword("NewPassword123");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("currentPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.matches("NewPassword123", "encodedPassword")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword123")).thenReturn("newEncodedPassword");
        when(userRepository.save(testUser)).thenReturn(testUser);

        UserEntity result = userService.updatePassword(1, updatePasswordDto, testToken);

        assertEquals("newEncodedPassword", result.getPassword());
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdatePassword_WeakPassword() {
        UpdatePasswordDto updatePasswordDto = new UpdatePasswordDto();
        updatePasswordDto.setCurrentPassword("currentPassword");
        updatePasswordDto.setNewPassword("weak");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("currentPassword", "encodedPassword")).thenReturn(true);

        assertThrows(WeakPasswordException.class, 
            () -> userService.updatePassword(1, updatePasswordDto, testToken));
    }

    @Test
    void testUpdateProfilePicture_Success() throws IOException {
        MockMultipartFile file = new MockMultipartFile("image", "test.jpg", "image/jpeg", "test data".getBytes());
        Image mockImage = new Image();
        mockImage.setImageUrl("http://test.com/image.jpg");

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(imageService.createPhoto(file, ImageType.PROFILE_PICTURE)).thenReturn(mockImage);
        when(imageRepository.save(mockImage)).thenReturn(mockImage);
        when(userRepository.save(testUser)).thenReturn(testUser);

        String result = userService.updateProfilePicture(1, file, testToken);

        assertEquals("http://test.com/image.jpg", result);
        verify(imageService).createPhoto(file, ImageType.PROFILE_PICTURE);
    }

    @Test
    void testDelete_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        assertDoesNotThrow(() -> userService.delete(1));
        verify(userRepository).delete(testUser);
    }

    @Test
    void testGetMyProfile_Success() {
        Image profileImage = new Image();
        profileImage.setImageType(ImageType.PROFILE_PICTURE);
        profileImage.setImageUrl("http://profile.jpg");
        
        Image backgroundImage = new Image();
        backgroundImage.setImageType(ImageType.BACKGROUND_PICTURE);
        backgroundImage.setImageUrl("http://background.jpg");
        
        testUser.getImages().add(profileImage);
        testUser.getImages().add(backgroundImage);

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        MyProfileDto result = userService.getMyProfile(testToken);

        assertEquals(1, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("Test description", result.getDescription());
        assertEquals("http://profile.jpg", result.getPhotoUrl());
        assertEquals("http://background.jpg", result.getBackgroundUrl());
    }

    @Test
    void testGetFavouriteRecipes_Success() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        recipe.setRecipeName("Test Recipe");
        recipe.setCategory("Breakfast");
        recipe.setServings(2);
        recipe.setDifficulty(1);
        recipe.setPrepareTime(15);
        recipe.setLanguage("en");
        recipe.setImages(new ArrayList<>());
        recipe.setIngredients(new ArrayList<>());
        recipe.setRatings(new ArrayList<>());
        
        testUser.getFavouriteRecipes().add(recipe);

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        MyProfileDto result = userService.getFavouriteRecipes(testToken);

        assertNotNull(result.getFavourites());
        assertEquals(1, result.getFavourites().size());
        assertEquals("Test Recipe", result.getFavourites().get(0).getRecipeName());
    }

    @Test
    void testGetUserRecipes_Success() {
        Recipe recipe = new Recipe();
        recipe.setId(1);
        recipe.setRecipeName("User Recipe");
        recipe.setCategory("Lunch");
        recipe.setServings(4);
        recipe.setDifficulty(2);
        recipe.setPrepareTime(30);
        recipe.setLanguage("en");
        recipe.setImages(new ArrayList<>());
        recipe.setIngredients(new ArrayList<>());
        
        Rating rating = new Rating();
        rating.setValue(5);
        List<Rating> ratings = List.of(rating);
        recipe.setRatings(ratings);
        
        testUser.getUserRecipes().add(recipe);

        when(jwtService.extractId("testtoken123")).thenReturn(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        MyProfileDto result = userService.getUserRecipes(testToken);

        assertNotNull(result.getUserRecipes());
        assertEquals(1, result.getUserRecipes().size());
        MyProfileRecipeDto recipeDto = result.getUserRecipes().get(0);
        assertEquals("User Recipe", recipeDto.getRecipeName());
        assertEquals(5L, recipeDto.getAvgRating());
    }

    @Test
    void testUpdateUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(testUser)).thenReturn(testUser);

        UserEntity result = userService.updateUser(1, "ADMIN", "new@example.com", "newusername");

        assertEquals("ADMIN", result.getRole());
        assertEquals("new@example.com", result.getEmail());
        assertEquals("newusername", result.getUsername());
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateUser_EmailAlreadyExists() {
        UserEntity anotherUser = new UserEntity();
        anotherUser.setId(2);
        
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(anotherUser));

        assertThrows(UserEmailAlreadyExistException.class, 
            () -> userService.updateUser(1, "USER", "existing@example.com", "username"));
    }

    @Test
    void testGetProfilePicture() {
        Image profileImage = new Image();
        profileImage.setImageType(ImageType.PROFILE_PICTURE);
        profileImage.setImageUrl("http://profile.jpg");
        
        Image otherImage = new Image();
        otherImage.setImageType(ImageType.BACKGROUND_PICTURE);
        otherImage.setImageUrl("http://background.jpg");
        
        testUser.getImages().add(profileImage);
        testUser.getImages().add(otherImage);

        String result = userService.getProfilePicture(testUser);

        assertEquals("http://profile.jpg", result);
    }

    @Test
    void testGetProfilePicture_NoImage() {
        String result = userService.getProfilePicture(testUser);

        assertNull(result);
    }

    @Test
    void testGetBackgroundPicture() {
        Image backgroundImage = new Image();
        backgroundImage.setImageType(ImageType.BACKGROUND_PICTURE);
        backgroundImage.setImageUrl("http://background.jpg");
        
        testUser.getImages().add(backgroundImage);

        String result = userService.getBackgroundPicture(testUser);

        assertEquals("http://background.jpg", result);
    }
}