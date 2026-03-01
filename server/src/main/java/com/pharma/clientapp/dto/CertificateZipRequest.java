package com.pharma.clientapp.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "Запрос на скачивание сертификатов в ZIP-архиве")
public class CertificateZipRequest {
    
    @Schema(description = "Список UID изображений сертификатов для скачивания")
    private List<String> certificateImageUids;
    
    @Schema(description = "Список UID товаров для скачивания всех сертификатов по товарам")
    private List<String> productUids;
    
    @Schema(description = "Номер накладной для скачивания всех сертификатов по накладной")
    private String invoiceNumber;
    
    public CertificateZipRequest() {}
    
    public CertificateZipRequest(List<String> certificateImageUids) {
        this.certificateImageUids = certificateImageUids;
    }
    
    public CertificateZipRequest(List<String> certificateImageUids, List<String> productUids, String invoiceNumber) {
        this.certificateImageUids = certificateImageUids;
        this.productUids = productUids;
        this.invoiceNumber = invoiceNumber;
    }
}
