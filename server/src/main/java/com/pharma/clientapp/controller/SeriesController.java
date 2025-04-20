package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Series;
import com.pharma.clientapp.service.SeriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SeriesController {
    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @GetMapping
    public List<Series> getAllSeries() {
        return seriesService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Series> getSeriesById(@PathVariable String uid) {
        return seriesService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Series createSeries(@RequestBody Series series) {
        return seriesService.save(series);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteSeries(@PathVariable String uid) {
        seriesService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
