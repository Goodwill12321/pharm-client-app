package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "goods")
public class Good {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 500)
    private String name;

    @Column(name = "name_min", length = 150)
    private String nameMin;

    @Column(length = 150)
    private String producer;

    @Column(length = 150)
    private String country;

    @Column(name = "gv", insertable = false, updatable = true)
    private Boolean gv;

    @Column(name = "mark", insertable = false, updatable = true)
    private Boolean mark;

    @Column(name = "mark_type", length = 50)
    private String markType;

    @Column(name = "mnn", length = 300)
    private String mnn;

    @Column(name = "temperature_mode", length = 30)
    private String temperatureMode;

    @Column(name = "create_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
