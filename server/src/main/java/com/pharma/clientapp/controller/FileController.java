package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.File;
import com.pharma.clientapp.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/files")
public class FileController {
    @Autowired
    private FileService fileService;

    @GetMapping
    public List<File> getAllFiles() {
        return fileService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<File> getFilesById(@PathVariable String uid) {
        return fileService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public File createFiles(@RequestBody File file) {
        return fileService.save(file);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteFiles(@PathVariable String uid) {
        fileService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
