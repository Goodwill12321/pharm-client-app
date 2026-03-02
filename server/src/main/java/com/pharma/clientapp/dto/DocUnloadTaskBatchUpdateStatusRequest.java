package com.pharma.clientapp.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class DocUnloadTaskBatchUpdateStatusRequest {
    private List<DocUnloadTaskBatchUpdateStatusItem> items;

    @Getter
    public static class DocUnloadTaskBatchUpdateStatusItem {
        private String uid;
        private Boolean isUnloaded;
        private java.time.LocalDateTime unloadTime;
        private String unloadComment;
    }
}
