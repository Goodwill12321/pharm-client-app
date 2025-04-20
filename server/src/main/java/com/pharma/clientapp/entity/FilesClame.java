package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "files_clame")
public class FilesClame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uid_clame", length = 36)
    private String uidClame;

    @Column(name = "uid_file", length = 36)
    private String uidFile;
}
