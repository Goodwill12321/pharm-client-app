package com.pharma.clientapp.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "DTO для автодополнения при поиске сертификатов")
public class CertificateAutocompleteDto {
    
    @Schema(description = "Значение для отображения")
    private String value;
    
    @Schema(description = "Дополнительное описание (опционально)")
    private String description;
    
    @Schema(description = "Тип данных: INVOICE, PRODUCT, SERIES, CERTIFICATE")
    private String type;
    
    public CertificateAutocompleteDto() {}
    
    public CertificateAutocompleteDto(String value, String type) {
        this.value = value;
        this.type = type;
    }
    
    public CertificateAutocompleteDto(String value, String description, String type) {
        this.value = value;
        this.description = description;
        this.type = type;
    }
}
