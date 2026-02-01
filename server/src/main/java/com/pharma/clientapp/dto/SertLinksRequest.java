package com.pharma.clientapp.dto;

import lombok.Data;

import java.util.List;

@Data
public class SertLinksRequest {
    private String sertUid;
    private String image;
    private String sertNo;
    private List<String> goodUids; // List of good UIDs to associate with this certificate
    private List<String> seriesUids; // List of series UIDs to associate with this certificate
}
