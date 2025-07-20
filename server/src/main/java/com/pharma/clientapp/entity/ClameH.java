package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "clame_h")
public class ClameH {
    @Column(name = "uid_us", length = 36)
    private String uidUs;

    @Column(name = "uid_doc_osn", length = 36)
    private String uidDocOsn;

    @Id
    @GeneratedValue(generator = "uuid2")
    @org.hibernate.annotations.GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(length = 36, updatable = false, nullable = false)
    @Schema(hidden = true)
    private String uid;

    @Column(length = 20)
    private String code;

    @Column(name = "docnum", length = 20)
    private String docNum;

    @Column(name = "docdate")
    private LocalDateTime docDate;

    @Column(name = "client_uid", length = 36)
    private String clientUid;

    @Column(length = 1000)
    private String comment;

    @Column(length = 50)
    private String status;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
