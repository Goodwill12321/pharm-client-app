package com.pharma.clientapp.dto;

import com.pharma.clientapp.entity.Sert;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * DTO for batch updating multiple certificates with their goods and series links
 */
@Data
public class SertBatchLinksRequest {
    /**
     * List of certificates to update
     */
    @NotEmpty(message = "At least one certificate must be provided")
    @Valid
    private List<Sert> serts;

    /**
     * Map of links by certificate UID
     * Key: Sert UID
     * Value: Links for the certificate
     */
    @NotNull(message = "Links map cannot be null")
    private Map<@NotEmpty String, @Valid SertLinksRequest> links;
}