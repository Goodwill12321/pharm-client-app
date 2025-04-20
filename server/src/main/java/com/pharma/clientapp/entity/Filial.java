package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "filials")
public class Filial {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 150)
    private String name;
}
