package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.DocumentType;
import com.pharma.clientapp.repository.DocumentTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentTypeService {
    private final DocumentTypeRepository documentTypeRepository;

    public DocumentTypeService(DocumentTypeRepository documentTypeRepository) {
        this.documentTypeRepository = documentTypeRepository;
    }

    public List<DocumentType> findAll() {
        return documentTypeRepository.findAll();
    }

    public Optional<DocumentType> findById(String uid) {
        return documentTypeRepository.findById(uid);
    }

    public DocumentType save(DocumentType documentType) {
        return documentTypeRepository.save(documentType);
    }

    public void deleteById(String uid) {
        documentTypeRepository.deleteById(uid);
    }
}
