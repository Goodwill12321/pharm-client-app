package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.SertLinksRequest;
import com.pharma.clientapp.dto.SertBatchLinksRequest;
import com.pharma.clientapp.dto.CertificateSearchRequest;
import com.pharma.clientapp.dto.CertificateInfoDto;
import com.pharma.clientapp.dto.CertificateAutocompleteDto;
//import jakarta.validation.Valid;
import com.pharma.clientapp.entity.Sert;
import com.pharma.clientapp.service.SertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sert")
public class SertController {
    private final SertService sertService;

    public SertController(SertService sertService) {
        this.sertService = sertService;
    }

    @GetMapping
    public List<Sert> getAllSert() {
        return sertService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Sert> getSertById(@PathVariable String uid) {
        return sertService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
     * Добавляет новый сертификат (Sert) или обновляет существующий по uid (upsert).
     * Если uid уже есть в базе — запись обновляется, иначе создается новая.
     */
    public Sert upsertSert(@RequestBody Sert sert) {
        return sertService.save(sert);
    }

    @PostMapping("/add_batch")
    /**
     * Добавляет или обновляет список сертификатов (batch upsert).
     * Если uid уже есть в базе — запись обновляется, иначе создается новая.
     */
    public List<Sert> upsertSertsBatch(@RequestBody List<Sert> serts) {
        return sertService.saveAll(serts);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteSert(@PathVariable String uid) {
        sertService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Updates a certificate and its associations with goods and series in a single transaction
     * @param request The update request containing certificate and association data
     * @return The updated Sert entity with HTTP 200 status, or 404 if not found
     */
    @PutMapping("/add_with_links")
    public ResponseEntity<Sert> updateSertWithLinks(@RequestBody SertLinksRequest request) {
        try {
            Sert updatedSert = sertService.updateSertWithLinks(request);
            return ResponseEntity.ok(updatedSert);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Updates multiple certificates with their goods and series links in a single transaction
     * @param batchRequest The batch request containing certificates and their links
     * @return List of updated Sert entities with HTTP 200 status, or 400 if request is invalid
     */
    @PostMapping("/add_batch_with_links")
    public ResponseEntity<?> batchUpdateSertsWithLinks(
            @RequestBody SertBatchLinksRequest batchRequest) {
        try {
            List<Sert> updatedSerts = sertService.batchUpdateSertsWithLinks(
                batchRequest.getSerts(),
                batchRequest.getLinks()
            );
            return ResponseEntity.ok(updatedSerts);
                } catch (RuntimeException e) {
            System.err.println("Batch update error: " + e.getMessage());
            
            // Check for FK constraint violations
            String message = e.getMessage();
            if (message != null) {
                if (message.contains("sert_goods_good_uid_fkey") || 
                    message.contains("foreign key constraint") && message.contains("good")) {
                    return ResponseEntity.badRequest().body("Нарушение целостности внешнего ключа: не найдены товары с указанными UID");
                }
                if (message.contains("sert_series_series_uid_fkey") || 
                    message.contains("foreign key constraint") && message.contains("series")) {
                    return ResponseEntity.badRequest().body("Нарушение целостности внешнего ключа: не найдены серии с указанными UID");
                }
                if (message.contains("insert or update on table") && 
                    message.contains("violates foreign key constraint")) {
                    return ResponseEntity.badRequest().body("Нарушение целостности внешнего ключа: ссылочные данные не найдены");
                }
            }
            
            return ResponseEntity.badRequest().body("Ошибка при обновлении сертификатов: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Внутренняя ошибка сервера: " + e.getMessage());
        }
    }
    
    /**
     * Поиск сертификатов по различным фильтрам
     * @param searchRequest Параметры поиска
     * @return Список найденных сертификатов с связанными данными
     */
    @PostMapping("/search")
    public ResponseEntity<List<CertificateInfoDto>> searchCertificates(@RequestBody CertificateSearchRequest searchRequest) {
        try {
            List<CertificateInfoDto> results = sertService.searchCertificates(searchRequest);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Search error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Автодополнение для полей поиска
     * @param type Тип данных (INVOICE, PRODUCT, SERIES, CERTIFICATE)
     * @param query Строка поиска (минимум 3 символа)
     * @return Список предложений для автодополнения
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<List<CertificateAutocompleteDto>> autocomplete(
            @RequestParam String type,
            @RequestParam String query) {
        try {
            if (query == null || query.length() < 3) {
                return ResponseEntity.ok(List.of());
            }
            
            List<CertificateAutocompleteDto> results = sertService.autocomplete(type, query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Autocomplete error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
