package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

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

    @Column(name = "is_main")
    private Boolean isMain;
}
