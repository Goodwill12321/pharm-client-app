package com.pharma.clientapp.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "sert_images")
public class SertImage {
    @Id
    @Column(length = 36, updatable = false, nullable = false)
    @JsonProperty("uidImage")
    private String uid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid_sert", nullable = true)
    @Schema(hidden = true)
    private Sert sert;

    @Column(length = 300, nullable = false)
    private String image;

    @Column(name = "image_loaded", insertable = false, updatable = true)
    private Boolean imageLoaded;

    @Column(name = "create_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
