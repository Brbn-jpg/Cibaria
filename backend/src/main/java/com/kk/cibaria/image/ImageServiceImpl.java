package com.kk.cibaria.image;

import com.cloudinary.Cloudinary;
import com.kk.cibaria.cloudinary.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageServiceImpl implements ImageService {
    private final CloudinaryService cloudinaryService;
    private final ImageRepository imageRepository;

    public ImageServiceImpl(CloudinaryService cloudinaryService, ImageRepository imageRepository) {
        this.cloudinaryService = cloudinaryService;
        this.imageRepository = imageRepository;
    }


    @Override
    public Image createPhoto(MultipartFile file) throws IOException {
        Image image = cloudinaryService.addPhoto(file);
        return imageRepository.save(image);
    }

    @Override
    public void deletePhoto(String publicId) {
        cloudinaryService.removePhoto(publicId);
    }
}
