package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Debitorka;
import com.pharma.clientapp.service.DebitorkaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debitorka")
public class DebitorkaController {
    private final DebitorkaService debitorkaService;

    public DebitorkaController(DebitorkaService debitorkaService) {
        this.debitorkaService = debitorkaService;
    }

    @GetMapping
    public List<Debitorka> getAllDebitorka() {
        return debitorkaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Debitorka> getDebitorkaById(@PathVariable Long id) {
        return debitorkaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Debitorka createDebitorka(@RequestBody Debitorka debitorka) {
        return debitorkaService.save(debitorka);
    }

    @GetMapping("/overdue")
    public List<Debitorka> getOverdueDebitorka() {
        return debitorkaService.findOverdue();
    }

    @GetMapping("/overdue/summary")
    public Map<String, Object> getOverdueSummary() {
        int docCount = debitorkaService.countOverdue();
        double sum = debitorkaService.sumOverdue();
        Map<String, Object> result = new HashMap<>();
        result.put("doc_count", docCount);
        result.put("sum", sum);
        return result;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebitorka(@PathVariable Long id) {
        debitorkaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
