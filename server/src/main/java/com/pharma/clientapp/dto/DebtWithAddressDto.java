package com.pharma.clientapp.dto;

import java.time.LocalDate;

public class DebtWithAddressDto {
    private Long id;
    private String docUid;
    private String ulUid;
    private Integer otsrochkaDay;
    private LocalDate payDate;
    private Integer ostatokDay;
    private Integer prosrochkaDay;
    private Double sumDoc;
    private Double sumPaid;
    private Double sumDolg;
    private String address;
    private String docNum;
    private String clientName; // название клиента

    public DebtWithAddressDto(Long id, String docUid, String ulUid, Integer otsrochkaDay, LocalDate payDate, Integer ostatokDay, Integer prosrochkaDay, Double sumDoc, Double sumPaid, Double sumDolg, String address, String docNum, String clientName) {
        this.id = id;
        this.docUid = docUid;
        this.ulUid = ulUid;
        this.otsrochkaDay = otsrochkaDay;
        this.payDate = payDate;
        this.ostatokDay = ostatokDay;
        this.prosrochkaDay = prosrochkaDay;
        this.sumDoc = sumDoc;
        this.sumPaid = sumPaid;
        this.sumDolg = sumDolg;
        this.address = address;
        this.docNum = docNum;
        this.clientName = clientName;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDocUid() { return docUid; }
    public void setDocUid(String docUid) { this.docUid = docUid; }
    public String getUlUid() { return ulUid; }
    public void setUlUid(String ulUid) { this.ulUid = ulUid; }
    public Integer getOtsrochkaDay() { return otsrochkaDay; }
    public void setOtsrochkaDay(Integer otsrochkaDay) { this.otsrochkaDay = otsrochkaDay; }
    public LocalDate getPayDate() { return payDate; }
    public void setPayDate(LocalDate payDate) { this.payDate = payDate; }
    public Integer getOstatokDay() { return ostatokDay; }
    public void setOstatokDay(Integer ostatokDay) { this.ostatokDay = ostatokDay; }
    public Integer getProsrochkaDay() { return prosrochkaDay; }
    public void setProsrochkaDay(Integer prosrochkaDay) { this.prosrochkaDay = prosrochkaDay; }
    public Double getSumDoc() { return sumDoc; }
    public void setSumDoc(Double sumDoc) { this.sumDoc = sumDoc; }
    public Double getSumPaid() { return sumPaid; }
    public void setSumPaid(Double sumPaid) { this.sumPaid = sumPaid; }
    public Double getSumDolg() { return sumDolg; }
    public void setSumDolg(Double sumDolg) { this.sumDolg = sumDolg; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDocNum() { return docNum; }
    public void setDocNum(String docNum) { this.docNum = docNum; }
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
}
