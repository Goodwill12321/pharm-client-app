package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
