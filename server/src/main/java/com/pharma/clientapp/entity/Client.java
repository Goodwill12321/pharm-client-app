package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "client")
public class Client {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 20)
    private String code;

    @Column(length = 200)
    private String name;

    @Column(name = "delivery_address", length = 300)
    private String deliveryAddress;

    @Column(name = "ul", length = 36)
    private String ul;

    @Column(name = "email_info", length = 100)
    private String emailInfo;

    @Column(name = "email_nakl", length = 100)
    private String emailNakl;

    @Column(length = 1000)
    private String status;

    @Column(length = 12)
    private String inn;

    @Column(length = 10)
    private String kpp;

    @Column(name = "filial_uid", length = 36)
    private String filialUid;

    @Column(name = "constraint_flag")
    private Boolean constraintFlag;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
