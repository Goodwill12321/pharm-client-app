package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.SertSeries;
import com.pharma.clientapp.service.SertSeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sert-series")
public class SertSeriesController {
    private final SertSeriesService sertSeriesService;

    public SertSeriesController(SertSeriesService sertSeriesService) {
        this.sertSeriesService = sertSeriesService;
    }

    @GetMapping
    public List<SertSeries> getAllSertSeries() {
        return sertSeriesService.findAll();
    }

    @GetMapping("/{sertUid}/{seriesUid}")
    public ResponseEntity<SertSeries> getSertSeriesById(
            @PathVariable String sertUid, 
            @PathVariable String seriesUid) {
        return sertSeriesService.findById(sertUid, seriesUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
     * Добавляет новую связь сертификата с серией (SertSeries) или обновляет существующую по композитному ключу (sertUid, seriesUid).
     */
    public SertSeries upsertSertSeries(@RequestBody SertSeries sertSeries) {
        return sertSeriesService.save(sertSeries);
    }

    @PostMapping("/add_batch")
    /**
     * Добавляет или обновляет список связей сертификатов с сериями (batch upsert).
     */
    public List<SertSeries> upsertSertSeriesBatch(@RequestBody List<SertSeries> sertSeriesList) {
        return sertSeriesService.saveAll(sertSeriesList);
    }

    @DeleteMapping("/{sertUid}/{seriesUid}")
    public ResponseEntity<Void> deleteSertSeries(
            @PathVariable String sertUid, 
            @PathVariable String seriesUid) {
        if (!sertSeriesService.findById(sertUid, seriesUid).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        sertSeriesService.deleteById(sertUid, seriesUid);
        return ResponseEntity.noContent().build();
    }
}
