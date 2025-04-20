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
    public Sert createSert(@RequestBody Sert sert) {
        return sertService.save(sert);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteSert(@PathVariable String uid) {
        sertService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
