package com.pharma.clientapp.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DocUnloadTaskViewDto {
    private final String uid;
    private final LocalDateTime requestTime;
    private final String contactUid;
    private final String contactName;
    private final String docType;
    private final String docUid;
    private final String docNum;
    private final LocalDateTime docDate;
    private final Boolean isUnloaded;
    private final LocalDateTime unloadTime;
    private final LocalDateTime statusUpdateTime;
    private final String unloadComment;
    private final Boolean isDel;

    public DocUnloadTaskViewDto(
        String uid,
        LocalDateTime requestTime,
        String contactUid,
        String contactName,
        String docType,
        String docUid,
        String docNum,
        LocalDateTime docDate,
        Boolean isUnloaded,
        LocalDateTime unloadTime,
        LocalDateTime statusUpdateTime,
        String unloadComment,
        Boolean isDel
    ) {
        this.uid = uid;
        this.requestTime = requestTime;
        this.contactUid = contactUid;
        this.contactName = contactName;
        this.docType = docType;
        this.docUid = docUid;
        this.docNum = docNum;
        this.docDate = docDate;
        this.isUnloaded = isUnloaded;
        this.unloadTime = unloadTime;
        this.statusUpdateTime = statusUpdateTime;
        this.unloadComment = unloadComment;
        this.isDel = isDel;
    }
}
