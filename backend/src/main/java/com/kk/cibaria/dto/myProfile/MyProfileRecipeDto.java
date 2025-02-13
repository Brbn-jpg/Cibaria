package com.kk.cibaria.dto.myProfile;

import lombok.Data;

@Data
public class MyProfileRecipeDto {
    private String recipeName;
    private int servings;
    private int difficulty;
    private int prepareTime;
    private String category;
    private Long avgRating;
}
