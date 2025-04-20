package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "goods_type")
public class GoodsType {
    @Id
    @Column(length = 36)
    private String uid;

    @Column(length = 200)
    private String name;
}
