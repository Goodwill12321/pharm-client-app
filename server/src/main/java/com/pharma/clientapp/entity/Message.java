package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(generator = "uuid2")
    @org.hibernate.annotations.GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(length = 36, updatable = false, nullable = false)
    private String uid;

    @Column(name = "object_uid", length = 36)
    private String objectUid;

    @Column(name = "object_type", length = 100)
    private String objectType;

    @Column(name = "create_time", insertable = false, updatable = false)
    private LocalDateTime createTime;

    @Column(name = "update_time", insertable = false, updatable = false)
    private LocalDateTime updateTime;

    @Column(name = "read_time")
    private LocalDateTime readTime;

    @Column(name = "sender", length = 36)
    private String sender;

    @Column(name = "session_uid", length = 36)
    private String sessionUid;

    @Column(length = 2000)
    private String message;
}
