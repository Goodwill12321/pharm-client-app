package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "ul")
public class Ul {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 20)
    private String code;

    @Column(length = 200)
    private String name;

    @Column(length = 300)
    private String address;

    @Column(length = 12)
    private String inn;

    @Column(length = 10)
    private String kpp;

    @Column(length = 1000)
    private String status;

    @Column(name = "constraint_flag")
    private Boolean constraintFlag;

    @Column(name = "create_time")
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time")
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
