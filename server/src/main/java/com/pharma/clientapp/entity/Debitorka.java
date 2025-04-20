package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "debitorka")
public class Debitorka {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doc_uid", length = 36)
    private String docUid;

    @Column(name = "ul_uid", length = 36)
    private String ulUid;

    @Column(name = "Otsrochka_Day")
    private Integer otsrochkaDay;

    @Column(name = "Pay_Date")
    private LocalDate payDate;

    @Column(name = "Ostatok_Day")
    private Integer ostatokDay;

    @Column(name = "Prosrochka_Day")
    private Integer prosrochkaDay;

    @Column(name = "Sum_Doc")
    private Double sumDoc;

    @Column(name = "Sum_Paid")
    private Double sumPaid;

    @Column(name = "Sum_Dolg")
    private Double sumDolg;
}
