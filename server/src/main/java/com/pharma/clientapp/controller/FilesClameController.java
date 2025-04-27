package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.FilesClame;
import com.pharma.clientapp.service.FilesClameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/files-clame")
public class FilesClameController {
    @Autowired
    private FilesClameService filesClameService;

    @GetMapping
    public List<FilesClame> getAllFilesClame() {
        return filesClameService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FilesClame> getFilesClameById(@PathVariable Long id) {
        return filesClameService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FilesClame createFilesClame(@RequestBody FilesClame filesClame) {
        return filesClameService.save(filesClame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFilesClame(@PathVariable Long id) {
        filesClameService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
