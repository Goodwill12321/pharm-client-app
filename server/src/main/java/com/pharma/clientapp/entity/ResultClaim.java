package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "result_claim")
public class ResultClaim {
    @Id
    @Column(length = 36)
    @Schema(hidden = true)
    private String uid;

    @Column(length = 100)
    private String name;
}
