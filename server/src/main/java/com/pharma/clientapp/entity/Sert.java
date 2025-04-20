package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "sert")
public class Sert {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 300)
    private String image;

    @Column(name = "sertno", length = 50)
    private String sertNo;

    @Column(name = "image_loaded")
    private Boolean imageLoaded;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
