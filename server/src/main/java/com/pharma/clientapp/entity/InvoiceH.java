package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "invoice_h")
public class InvoiceH {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(name = "type_uid", length = 36)
    private String typeUid;

    @Column(name = "docnum", length = 20)
    private String docNum;

    @Column(name = "docdate")
    private LocalDateTime docDate;

    @Column(name = "ndssum")
    private Double ndsSum;

    @Column(name = "sumnonds")
    private Double sumNoNds;

    @Column(name = "sumsnds")
    private Double sumSNds;

    @Column(name = "client_uid", length = 36)
    private String clientUid;

    @Column(length = 50)
    private String status;

    @Column(length = 200)
    private String comment;

    @Column(name = "status_buh", length = 50)
    private String statusBuh;

    @Column(name = "filial", length = 36)
    private String filial;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
