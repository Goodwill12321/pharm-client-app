package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, String> {
}
