package com.pharma.clientapp.controller;

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
}
