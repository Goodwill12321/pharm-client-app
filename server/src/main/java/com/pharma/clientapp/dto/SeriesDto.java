package com.pharma.clientapp.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Schema(description = "DTO для серии товара")
public class SeriesDto {
    
    @Schema(description = "UID серии (для обновления)")
    @Size(max = 36, message = "UID не должен превышать 36 символов")
    private String uid;
    
    @Schema(description = "Наименование серии", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Наименование серии обязательно")
    @Size(max = 50, message = "Наименование не должно превышать 50 символов")
    private String name;
    
    @Schema(description = "UID товара")
    @Size(max = 36, message = "UID товара не должен превышать 36 символов")
    private String goodUid;
    
    @Schema(description = "Срок годности до")
    private LocalDateTime dateExpBefore;
    
    @Schema(description = "Дата производства")
    private LocalDateTime dateProduction;
    
    @Schema(description = "Наименование товара (только для чтения)")
    private String goodName;
}
