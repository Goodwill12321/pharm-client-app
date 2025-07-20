package com.pharma.clientapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Entity
@Table(name = "clame_t")
public class ClameT {
    @Id
    @GeneratedValue(generator = "uuid2")
    @org.hibernate.annotations.GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "uid_line", length = 36, updatable = false, nullable = false)
    @Schema(hidden = true)
    private String uidLine;

    @Column(name = "uid", length = 36)
    private String uid;

    @Column(name = "uid_line_doc_osn", length = 36)
    private String uidLineDocOsn;

    @Column(name = "good_uid", length = 36)
    private String goodUid;

    @Column(name = "series_uid", length = 36)
    private String seriesUid;

    @Column(name = "qnt")
    private Double qnt;

    @Column(name = "type_clame", length = 36)
    private String typeClame;

    @Column(length = 1000)
    private String comment;

    @Column(length = 1000)
    private String result;
}
