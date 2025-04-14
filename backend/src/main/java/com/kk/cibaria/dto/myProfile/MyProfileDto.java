package com.kk.cibaria.dto.myProfile;

import lombok.Data;

import java.util.List;

@Data
public class MyProfileDto {
    private String photoUrl = null;
    private String username;
    private List<MyProfileRecipeDto> favourites;
}
