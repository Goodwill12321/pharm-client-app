package com.pharma.clientapp.dto;

@lombok.Data
public class InvoiceTWithNamesDto {
    private String uidLine;
    private String uid;
    private String goodUid;
    private String goodName;
    private Boolean isMarked; // признак маркировки из Good
    private String seriesUid;
    private String seriesName;
    private java.time.LocalDateTime dateExpBefore; // срок годности из Series
    private java.time.LocalDateTime dateProduction; // дата производства из Series
    private Double price;
    private Double qnt;
    private Double nds;
    private Double ndsSum;
    private Double sumNoNds;
    private Double sumSNds;
    private String gtin;
    private String ean;
    private java.time.LocalDateTime dateSaleProducer;
    private Double priceReestr;
    private Double priceProducer;

    public InvoiceTWithNamesDto(String uidLine, String uid, String goodUid, String goodName, Boolean isMarked, String seriesUid, String seriesName, java.time.LocalDateTime dateExpBefore, java.time.LocalDateTime dateProduction, Double price, Double qnt, Double nds, Double ndsSum, Double sumNoNds, Double sumSNds, String gtin, String ean, java.time.LocalDateTime dateSaleProducer, Double priceReestr, Double priceProducer) {
        this.uidLine = uidLine;
        this.uid = uid;
        this.goodUid = goodUid;
        this.goodName = goodName;
        this.isMarked = isMarked;
        this.seriesUid = seriesUid;
        this.seriesName = seriesName;
        this.dateExpBefore = dateExpBefore;
        this.dateProduction = dateProduction;
        this.price = price;
        this.qnt = qnt;
        this.nds = nds;
        this.ndsSum = ndsSum;
        this.sumNoNds = sumNoNds;
        this.sumSNds = sumSNds;
        this.gtin = gtin;
        this.ean = ean;
        this.dateSaleProducer = dateSaleProducer;
        this.priceReestr = priceReestr;
        this.priceProducer = priceProducer;
    }

}
