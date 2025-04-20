package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.ClameH;
import com.pharma.clientapp.service.ClameHService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clameh")
public class ClameHController {
    private final ClameHService clameHService;

    public ClameHController(ClameHService clameHService) {
        this.clameHService = clameHService;
    }

    @GetMapping
    public List<ClameH> getAllClameH() {
        return clameHService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<ClameH> getClameHById(@PathVariable String uid) {
        return clameHService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClameH createClameH(@RequestBody ClameH clameH) {
        return clameHService.save(clameH);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteClameH(@PathVariable String uid) {
        clameHService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
