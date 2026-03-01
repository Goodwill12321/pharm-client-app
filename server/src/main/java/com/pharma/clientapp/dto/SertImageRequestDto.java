package com.pharma.clientapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SertImageRequestDto {
    
    @NotBlank(message = "Image UID cannot be blank")
    private String uidImage;
    
    @NotBlank(message = "Certificate number cannot be blank")
    private String sertNo;
    
    @NotBlank(message = "Image path cannot be blank")
    private String image;
}
