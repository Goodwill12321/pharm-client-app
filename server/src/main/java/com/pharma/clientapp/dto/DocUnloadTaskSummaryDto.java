package com.pharma.clientapp.dto;

import lombok.Getter;

@Getter
public class DocUnloadTaskSummaryDto {
    private final String docUid;
    private final Long total;
    private final Long done;
    private final Long pending;

    public DocUnloadTaskSummaryDto(String docUid, Long total, Long done, Long pending) {
        this.docUid = docUid;
        this.total = total;
        this.done = done;
        this.pending = pending;
    }
}
