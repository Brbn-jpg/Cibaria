package com.kk.cibaria.image;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {
    Image createPhoto(MultipartFile file) throws IOException;

    void deletePhoto(String publicId);
}
