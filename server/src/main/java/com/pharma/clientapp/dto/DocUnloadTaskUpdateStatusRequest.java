package com.pharma.clientapp.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DocUnloadTaskUpdateStatusRequest {
    private Boolean isUnloaded;
    private LocalDateTime unloadTime;
    private String unloadComment;
}
