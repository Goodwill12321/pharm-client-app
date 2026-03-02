package com.pharma.clientapp.dto;

import java.time.LocalDateTime;

public interface DocUnloadTaskViewProjection {
    String getUid();
    LocalDateTime getRequestTime();
    String getContactUid();
    String getContactName();
    String getDocType();
    String getDocUid();
    String getDocnum();
    LocalDateTime getDocdate();
    Boolean getIsUnloaded();
    LocalDateTime getUnloadTime();
    LocalDateTime getStatusUpdateTime();
    String getUnloadComment();
    Boolean getIsDel();
}
