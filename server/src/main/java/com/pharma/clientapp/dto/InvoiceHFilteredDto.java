package com.pharma.clientapp.dto;

import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class InvoiceHFilteredDto {
    private String uid;
    private String typeUid;
    private String docNum;
    private LocalDateTime docDate;
    private Double ndsSum;
    private Double sumNoNds;
    private Double sumSNds;
    private String clientUid;
    private String clientName;
    private String status;
    private String comment;
    private String statusBuh;
    private String filial;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String deliveryAddress;
    private Boolean isDel;

    public InvoiceHFilteredDto(String uid, String typeUid, String docNum, LocalDateTime docDate, Double ndsSum, Double sumNoNds, Double sumSNds, String clientUid, String clientName, String status, String comment, String statusBuh, String filial, LocalDateTime createTime, LocalDateTime updateTime, Boolean isDel, String deliveryAddress) {
        this.uid = uid;
        this.typeUid = typeUid;
        this.docNum = docNum;
        this.docDate = docDate;
        this.ndsSum = ndsSum;
        this.sumNoNds = sumNoNds;
        this.sumSNds = sumSNds;
        this.clientUid = clientUid;
        this.clientName = clientName;
        this.status = status;
        this.comment = comment;
        this.statusBuh = statusBuh;
        this.filial = filial;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.isDel = isDel;
        this.deliveryAddress = deliveryAddress;
    }


}
