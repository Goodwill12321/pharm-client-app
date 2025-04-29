package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "invoice_t")
public class InvoiceT {
    @Id
    @Column(name = "uid_line", length = 36)
    private String uidLine;

    @Column(length = 36)
    private String uid;

    @Column(name = "good_uid", length = 36)
    private String goodUid;

    @Column(name = "series_uid", length = 36)
    private String seriesUid;

    @Column(name = "price")
    private Double price;

    @Column(name = "qnt")
    private Double qnt;

    @Column(name = "nds")
    private Double nds;

    @Column(name = "ndssum")
    private Double ndsSum;

    @Column(name = "sumnonds")
    private Double sumNoNds;

    @Column(name = "sumsnds")
    private Double sumSNds;

    @Column(name = "gtin", length = 30)
    private String gtin;

    @Column(name = "ean", length = 13)
    private String ean;

    @Column(name = "date_sale_producer")
    private LocalDateTime dateSaleProducer;

    @Column(name = "price_reestr")
    private Double priceReestr;

    @Column(name = "price_producer")
    private Double priceProducer;
}
