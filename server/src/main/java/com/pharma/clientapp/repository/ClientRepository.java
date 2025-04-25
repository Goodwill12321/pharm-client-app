package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, String> {
    @org.springframework.data.jpa.repository.Query("SELECT new com.pharma.clientapp.dto.ClientAddressDto(c.uid, c.name) " +
        "FROM Client c JOIN ClientContact cc ON cc.clientUid = c.uid " +
        "WHERE cc.contactUid = :contactUid AND (c.isDel IS NULL OR c.isDel = false)")
    java.util.List<com.pharma.clientapp.dto.ClientAddressDto> findAvailableAddressesByContactUid(String contactUid);
}
