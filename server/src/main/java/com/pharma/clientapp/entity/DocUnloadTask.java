package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "doc_unload_tasks")
public class DocUnloadTask {
    @Id
    @GeneratedValue
    @org.hibernate.annotations.UuidGenerator
    @Column(length = 36, updatable = false, nullable = false)
    private String uid;

    @Column(name = "request_time", insertable = false, updatable = false)
    private LocalDateTime requestTime;

    @Column(name = "contact_uid", length = 36, nullable = false)
    private String contactUid;

    @Column(name = "doc_type", length = 100, nullable = false)
    private String docType;

    @Column(name = "doc_uid", length = 36, nullable = false)
    private String docUid;

    @Column(name = "docnum", length = 20)
    private String docNum;

    @Column(name = "docdate")
    private LocalDateTime docDate;

    @Column(name = "is_unloaded", nullable = false)
    private Boolean isUnloaded;

    @Column(name = "unload_time")
    private LocalDateTime unloadTime;

    @Column(name = "status_update_time")
    private LocalDateTime statusUpdateTime;

    @Column(name = "unload_comment", length = 1000)
    private String unloadComment;

    @Column(name = "create_time", insertable = false, updatable = false)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    private LocalDateTime updateTime;

    @Column(name = "is_del")
    private Boolean isDel;
}
