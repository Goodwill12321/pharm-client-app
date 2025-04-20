package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clame_type")
public class ClameType {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 100)
    private String name;
}
