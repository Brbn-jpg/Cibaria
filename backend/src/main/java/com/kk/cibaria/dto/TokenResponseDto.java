package com.kk.cibaria.dto;

import lombok.Data;

@Data
public class TokenResponseDto {
    private String token;
    private String type="Bearer";
}
