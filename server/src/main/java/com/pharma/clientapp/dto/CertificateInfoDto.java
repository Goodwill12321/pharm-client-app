package com.pharma.clientapp.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Schema(description = "DTO для информации о сертификате с связанными данными")
public class CertificateInfoDto {
    
    @Schema(description = "UID изображения (внешний идентификатор картинки)")
    private String uidImage;
    
    @Schema(description = "UID сертификата (если привязан к изображению)")
    private String sertUid;
    
    @Schema(description = "Номер сертификата")
    private String certificateNumber;
    
    @Schema(description = "Путь к файлу изображения")
    private String imagePath;
    
    @Schema(description = "Наименование товара")
    private String productName;
    
    @Schema(description = "UID товара")
    private String productUid;
    
    @Schema(description = "Наименование серии (если есть)")
    private String seriesName;
    
    @Schema(description = "UID серии (если есть)")
    private String seriesUid;
    
    @Schema(description = "Тип привязки: PRODUCT или SERIES")
    private String linkType;
    
    @Schema(description = "Время создания")
    private LocalDateTime createTime;

    public CertificateInfoDto() {}

    public CertificateInfoDto(String uidImage, String sertUid, String certificateNumber, String imagePath, 
                            String linkType, String productName, String productUid, 
                            String seriesName, String seriesUid) {
        this.uidImage = uidImage;
        this.sertUid = sertUid;
        this.certificateNumber = certificateNumber;
        this.imagePath = imagePath;
        this.linkType = linkType;
        this.productName = productName;
        this.productUid = productUid;
        this.seriesName = seriesName;
        this.seriesUid = seriesUid;
    }
}
