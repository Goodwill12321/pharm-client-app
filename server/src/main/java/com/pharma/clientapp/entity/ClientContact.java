package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "client_contact")
public class ClientContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_uid", length = 36)
    private String clientUid;

    @Column(name = "contact_uid", length = 36)
    private String contactUid;
}
