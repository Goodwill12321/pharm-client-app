package com.pharma.clientapp.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "Запрос на поиск сертификатов")
public class CertificateSearchRequest {
    
    @Schema(description = "Номер накладной для поиска", example = "12345")
    private String invoiceNumber;
    
    @Schema(description = "Наименование товара для поиска", example = "Ацетилсалициловая кислота")
    private String productName;
    
    @Schema(description = "Наименование серии для поиска", example = "АБ123456")
    private String seriesName;
    
    @Schema(description = "Номер сертификата для поиска", example = "РОСС RU.ФМ01.Д12345")
    private String certificateNumber;
}
