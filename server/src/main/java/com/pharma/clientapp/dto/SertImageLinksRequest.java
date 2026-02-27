package com.pharma.clientapp.dto;

import lombok.Data;

import java.util.List;

@Data
public class SertImageLinksRequest {
    private String uidImage;
    private String image;
    private String sertNo;
    private List<String> goodUids;
    private List<String> seriesUids;
}
