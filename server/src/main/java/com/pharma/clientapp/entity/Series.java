package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "series")
public class Series {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 50)
    private String name;

    @Column(name = "date_expbefore")
    private LocalDateTime dateExpBefore;

    @Column(name = "date_production")
    private LocalDateTime dateProduction;

    @Column(name = "create_time")
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time")
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
