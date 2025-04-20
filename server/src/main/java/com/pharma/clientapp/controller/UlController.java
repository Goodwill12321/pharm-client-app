package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Ul;
import com.pharma.clientapp.service.UlService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/uls")
public class UlController {
    private final UlService ulService;

    public UlController(UlService ulService) {
        this.ulService = ulService;
    }

    @GetMapping
    public List<Ul> getAllUls() {
        return ulService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Ul> getUlById(@PathVariable String uid) {
        return ulService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ul createUl(@RequestBody Ul ul) {
        return ulService.save(ul);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteUl(@PathVariable String uid) {
        ulService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
