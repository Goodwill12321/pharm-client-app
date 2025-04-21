package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "contact")
public class Contact {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 150)
    private String name;

    @Column(length = 30)
    private String login;

    @Column(length = 30)
    private String password;

    @Column(name = "debitorka")
    private Boolean debitorka;

    @Column(name = "claims")
    private Boolean claims;

    @Column(length = 200)
    private String fio;

    @Column(length = 100)
    private String phone;

    @Column(length = 200)
    private String email;

    @Column(length = 500)
    private String function;

    @Column(length = 20)
    private String salt;

    @Column(name = "create_time")
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time")
    @Schema(hidden = true)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
