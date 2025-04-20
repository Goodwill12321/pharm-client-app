package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "document_type")
public class DocumentType {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 50)
    private String name;
}
