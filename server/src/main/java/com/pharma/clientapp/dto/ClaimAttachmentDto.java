package com.pharma.clientapp.dto;

import java.time.LocalDateTime;

public class ClaimAttachmentDto {
    private String uid;
    private String fileName;
    private String contentType;
    private Long sizeBytes;
    private LocalDateTime createTime;

    public ClaimAttachmentDto() {
    }

    public ClaimAttachmentDto(String uid, String fileName, String contentType, Long sizeBytes, LocalDateTime createTime) {
        this.uid = uid;
        this.fileName = fileName;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.createTime = createTime;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(Long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }
}
