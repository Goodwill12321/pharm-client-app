package com.pharma.clientapp.service;

import com.pharma.clientapp.dto.CertificateInfoDto;
import com.pharma.clientapp.dto.CertificateSearchRequest;
import com.pharma.clientapp.dto.CertificateZipRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Slf4j
public class CertificateZipService {
    
    private final SertService sertService;
    //private final FileService fileService;
    
    @Value("${app.file.storage.path:/data/files}")
    private String fileStoragePath;
    
    public CertificateZipService(SertService sertService, FileService fileService) {
        this.sertService = sertService;
        //this.fileService = fileService;
    }
    
    /**
     * Создает ZIP-архив с сертификатами
     * @param zipRequest запрос с UID сертификатов или номером накладной
     * @return путь к созданному ZIP-файлу
     */
    @Transactional
    public String createCertificatesZip(CertificateZipRequest zipRequest) throws IOException {
        List<CertificateInfoDto> certificates = getCertificatesForZip(zipRequest);
        
        if (certificates.isEmpty()) {
            throw new IllegalArgumentException("Не найдено сертификатов для архивации");
        }
        
        // Создаем временный файл для ZIP
        Path tempZipFile = Files.createTempFile("certificates-", ".zip");
        
        try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(tempZipFile.toFile()))) {
            // Группируем сертификаты по товарам и сериям
            Map<String, List<CertificateInfoDto>> groupedByProduct = certificates.stream()
                .filter(cert -> cert.getProductUid() != null)
                .collect(Collectors.groupingBy(
                    cert -> cert.getProductUid(),
                    LinkedHashMap::new,
                    Collectors.toList()
                ));
            
            // Обрабатываем сертификаты сгруппированные по товарам
            for (Map.Entry<String, List<CertificateInfoDto>> productEntry : groupedByProduct.entrySet()) {
                String productUid = productEntry.getKey();
                List<CertificateInfoDto> productCertificates = productEntry.getValue();
                
                // Получаем название товара из первого сертификата
                String productName = productCertificates.get(0).getProductName();
                if (productName == null || productName.trim().isEmpty()) {
                    productName = "Товар_" + productUid;
                }
                
                // Очищаем название файла от недопустимых символов
                String safeProductName = sanitizeFileName(productName);
                
                // Группируем сертификаты по сериям внутри товара
                Map<String, List<CertificateInfoDto>> groupedBySeries = productCertificates.stream()
                    .collect(Collectors.groupingBy(
                        cert -> cert.getSeriesUid() != null ? cert.getSeriesUid() : "NO_SERIES",
                        LinkedHashMap::new,
                        Collectors.toList()
                    ));
                
                for (Map.Entry<String, List<CertificateInfoDto>> seriesEntry : groupedBySeries.entrySet()) {
                    String seriesUid = seriesEntry.getKey();
                    List<CertificateInfoDto> seriesCertificates = seriesEntry.getValue();
                    
                    if ("NO_SERIES".equals(seriesUid)) {
                        // Сертификаты привязанные напрямую к товару
                        addCertificatesToZip(zipOut, seriesCertificates, safeProductName, null);
                    } else {
                        // Сертификаты привязанные к серии
                        String seriesName = seriesCertificates.get(0).getSeriesName();
                        if (seriesName == null || seriesName.trim().isEmpty()) {
                            seriesName = "Серия_" + seriesUid;
                        }
                        
                        String safeSeriesName = sanitizeFileName(seriesName);
                        addCertificatesToZip(zipOut, seriesCertificates, safeProductName, safeSeriesName);
                    }
                }
            }
            
            // Добавляем сертификаты без привязки к товару
            List<CertificateInfoDto> unlinkedCertificates = certificates.stream()
                .filter(cert -> cert.getProductUid() == null)
                .collect(Collectors.toList());
            
            if (!unlinkedCertificates.isEmpty()) {
                addCertificatesToZip(zipOut, unlinkedCertificates, "Без_привязки", null);
            }
        }
        
        log.info("Created ZIP archive with {} certificates at {}", certificates.size(), tempZipFile);
        return tempZipFile.toString();
    }
    
    /**
     * Получает список сертификатов для архивации на основе запроса
     */
    private List<CertificateInfoDto> getCertificatesForZip(CertificateZipRequest zipRequest) {
        if (zipRequest.getCertificateImageUids() != null && !zipRequest.getCertificateImageUids().isEmpty()) {
            // Скачиваем выбранные сертификаты по UID
            return sertService.findCertificatesByImageUids(zipRequest.getCertificateImageUids());
        } else if (zipRequest.getProductUids() != null && !zipRequest.getProductUids().isEmpty()) {
            // Скачиваем все сертификаты по товарам
            return sertService.findCertificatesByProductUids(zipRequest.getProductUids());
        } else if (zipRequest.getInvoiceNumber() != null && !zipRequest.getInvoiceNumber().trim().isEmpty()) {
            // Скачиваем все сертификаты по накладной
            CertificateSearchRequest searchRequest = new CertificateSearchRequest();
            searchRequest.setInvoiceNumber(zipRequest.getInvoiceNumber());
            return sertService.searchCertificates(searchRequest);
        }
        
        return Collections.emptyList();
    }
    
    /**
     * Добавляет сертификаты в ZIP-архив с указанной структурой папок
     */
    private void addCertificatesToZip(ZipOutputStream zipOut, List<CertificateInfoDto> certificates, 
                                     String productName, String seriesName) throws IOException {
        for (CertificateInfoDto cert : certificates) {
            if (cert.getImagePath() == null || cert.getImagePath().trim().isEmpty()) {
                log.warn("Certificate {} has no image path, skipping", cert.getUidImage());
                continue;
            }
            
            // Формируем путь в архиве
            String zipPath = productName;
            if (seriesName != null) {
                zipPath += "/" + seriesName;
            }
            
            // Получаем имя файла из пути или генерируем из номера сертификата
            String fileName = getFileNameFromCertificate(cert);
            zipPath += "/" + fileName;
            
            // Добавляем файл в архив
            addFileToZip(zipOut, cert.getImagePath(), zipPath);
        }
    }
    
    /**
     * Добавляет один файл в ZIP-архив
     */
    private void addFileToZip(ZipOutputStream zipOut, String imagePath, String zipPath) throws IOException {
        Path filePath = Paths.get(fileStoragePath, imagePath);
        
        if (!Files.exists(filePath)) {
            log.warn("File not found: {}", filePath);
            return;
        }
        
        ZipEntry zipEntry = new ZipEntry(zipPath);
        zipOut.putNextEntry(zipEntry);
        
        try (FileInputStream fis = new FileInputStream(filePath.toFile())) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = fis.read(buffer)) > 0) {
                zipOut.write(buffer, 0, length);
            }
        }
        
        zipOut.closeEntry();
    }
    
    /**
     * Получает имя файла для сертификата
     */
    private String getFileNameFromCertificate(CertificateInfoDto cert) {
        // Сначала пробуем извлечь из пути к файлу
        if (cert.getImagePath() != null) {
            String originalFileName = Paths.get(cert.getImagePath()).getFileName().toString();
            if (originalFileName != null && !originalFileName.trim().isEmpty()) {
                return originalFileName;
            }
        }
        
        // Если не получилось, генерируем из номера сертификата
        if (cert.getCertificateNumber() != null && !cert.getCertificateNumber().trim().isEmpty()) {
            return "сертификат_" + sanitizeFileName(cert.getCertificateNumber()) + ".pdf";
        }
        
        // В крайнем случае используем UID
        return "сертификат_" + cert.getUidImage() + ".pdf";
    }
    
    /**
     * Очищает строку от недопустимых символов для имени файла
     */
    private String sanitizeFileName(String fileName) {
        if (fileName == null) {
            return "unknown";
        }
        
        return fileName.replaceAll("[\\\\/:*?\"<>|]", "_")
                      .replaceAll("\\s+", "_")
                      .trim();
    }
}
