package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "client_manager")
public class ClientManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(hidden = true)
    private Long id;

    @Column(name = "client_uid", length = 36)
    private String clientUid;

    @Column(name = "staff_uid", length = 36)
    private String staffUid;

    @Column(name = "goods_type_uid", length = 36)
    private String goodsTypeUid;

    @Column(name = "is_main", insertable = false, updatable = true)
    private Boolean isMain;

    @Column(name = "create_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    @Schema(hidden = true)
    private LocalDateTime updateTime;
}
