package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
