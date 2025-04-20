package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.DocumentType;
import com.pharma.clientapp.service.DocumentTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documenttype")
public class DocumentTypeController {
    private final DocumentTypeService documentTypeService;

    public DocumentTypeController(DocumentTypeService documentTypeService) {
        this.documentTypeService = documentTypeService;
    }

    @GetMapping
    public List<DocumentType> getAllDocumentType() {
        return documentTypeService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<DocumentType> getDocumentTypeById(@PathVariable String uid) {
        return documentTypeService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DocumentType createDocumentType(@RequestBody DocumentType documentType) {
        return documentTypeService.save(documentType);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteDocumentType(@PathVariable String uid) {
        documentTypeService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
