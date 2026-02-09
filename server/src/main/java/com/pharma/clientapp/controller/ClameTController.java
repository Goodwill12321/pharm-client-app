package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.ClameT;
import com.pharma.clientapp.service.ClameTService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clamet")
public class ClameTController {
    private final ClameTService clameTService;

    public ClameTController(ClameTService clameTService) {
        this.clameTService = clameTService;
    }

    @GetMapping
    public List<ClameT> getAllClameT() {
        return clameTService.findAll();
    }

    @GetMapping("/{uidLine}")
    public ResponseEntity<ClameT> getClameTById(@PathVariable String uidLine) {
        return clameTService.findById(uidLine)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClameT createClameT(@RequestBody ClameT clameT) {
        return clameTService.save(clameT);
    }

    @PutMapping("/{uidLine}")
    public ResponseEntity<ClameT> updateClameT(@PathVariable String uidLine, @RequestBody ClameT patch) {
        return clameTService.findById(uidLine)
                .map(existing -> {
                    if (patch.getQnt() != null) existing.setQnt(patch.getQnt());
                    if (patch.getTypeClame() != null) existing.setTypeClame(patch.getTypeClame());
                    if (patch.getComment() != null) existing.setComment(patch.getComment());
                    if (patch.getResult() != null) existing.setResult(patch.getResult());
                    return ResponseEntity.ok(clameTService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{uidLine}")
    public ResponseEntity<Void> deleteClameT(@PathVariable String uidLine) {
        clameTService.deleteById(uidLine);
        return ResponseEntity.noContent().build();
    }
}
