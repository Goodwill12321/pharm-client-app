package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.ClameType;
import com.pharma.clientapp.service.ClameTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clametype")
public class ClameTypeController {
    private final ClameTypeService clameTypeService;

    public ClameTypeController(ClameTypeService clameTypeService) {
        this.clameTypeService = clameTypeService;
    }

    @GetMapping
    public List<ClameType> getAllClameType() {
        return clameTypeService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<ClameType> getClameTypeById(@PathVariable String uid) {
        return clameTypeService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClameType createClameType(@RequestBody ClameType clameType) {
        return clameTypeService.save(clameType);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteClameType(@PathVariable String uid) {
        clameTypeService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
