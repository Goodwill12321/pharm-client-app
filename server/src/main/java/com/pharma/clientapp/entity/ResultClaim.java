package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "result_claim")
public class ResultClaim {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 100)
    private String name;
}
