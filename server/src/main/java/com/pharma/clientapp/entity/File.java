package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue
    @org.hibernate.annotations.UuidGenerator
    @Column(length = 36, updatable = false, nullable = false)
    private String uid;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 2048)
    private String filePath;

    @Column(name = "content_type", length = 200)
    private String contentType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Column(name = "create_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime updateTime;
}
