package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Filial;
import com.pharma.clientapp.service.FilialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filials")
public class FilialController {
    @Autowired
    private FilialService filialService;

    @GetMapping
    public List<Filial> getAllFilials() {
        return filialService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Filial> getFilialsById(@PathVariable String uid) {
        return filialService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Filial createFilials(@RequestBody Filial filials) {
        return filialService.save(filials);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteFilials(@PathVariable String uid) {
        filialService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
