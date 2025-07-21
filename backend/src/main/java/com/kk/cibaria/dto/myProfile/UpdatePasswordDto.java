package com.kk.cibaria.dto.myProfile;

import lombok.Data;

// For later use
@Data
public class UpdatePasswordDto {
    private String currentPassword;
    private String newPassword;
}