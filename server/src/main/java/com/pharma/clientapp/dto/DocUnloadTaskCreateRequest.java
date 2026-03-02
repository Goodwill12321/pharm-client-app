package com.pharma.clientapp.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DocUnloadTaskCreateRequest {
    private String docType;
    private String docUid;
    private String docNum;
    private LocalDateTime docDate;
}
