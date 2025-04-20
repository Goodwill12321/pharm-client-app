package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "files")
public class File {
    @Id
    @Column(length = 36, insertable = false, updatable = false)
    private String uid;

    @Column(length = 200)
    private String files;
}
