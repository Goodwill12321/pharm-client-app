package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import io.swagger.v3.oas.annotations.media.Schema;
import org.hibernate.annotations.Formula;

@Data
@Entity
@Table(name = "debitorka")
public class Debitorka {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(hidden = true)
    private Long id;

    @Column(name = "doc_uid", length = 36)
    private String docUid;

    @Column(name = "", length = 36)
    private String ulUid;

    @Column(name = "doc_date")
    private LocalDate docDate;

    @Column(name = "Otsrochka_Day")
    private Integer otsrochkaDay;

    @Column(name = "pay_date", insertable = false, updatable = false)
    private LocalDate payDate;

    @Formula("CASE WHEN pay_date >= CURRENT_DATE THEN (pay_date - CURRENT_DATE) ELSE 0 END")
    private Integer ostatokDay;

    @Formula("CASE WHEN pay_date < CURRENT_DATE THEN (CURRENT_DATE - pay_date) ELSE 0 END")
    private Integer prosrochkaDay;

    @Column(name = "Sum_Doc")
    private Double sumDoc;

    @Column(name = "Sum_Paid")
    private Double sumPaid;

    @Column(name = "Sum_Dolg")
    private Double sumDolg;
}
