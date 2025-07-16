package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
//import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "client_contact")
public class ClientContact {
    @Id
    @Column(name = "uid", length = 36, updatable = false, nullable = false)
    @GeneratedValue(generator = "uuid2")
    @org.hibernate.annotations.GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private String uid;

    @Column(name = "client_uid", length = 36)
    private String clientUid;

    @Column(name = "contact_uid", length = 36)
    private String contactUid;
}
