package com.kk.cibaria.dto.myProfile;

import java.util.List;

import com.kk.cibaria.image.Image;

import lombok.Data;

@Data
public class MyProfileRecipeDto {
    private int id;
    private List<Image> imageUrl;
    private String recipeName;
    private int servings;
    private int difficulty;
    private int prepareTime;
    private String category;
    private Long avgRating;
}
