package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.ClientContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientContactRepository extends JpaRepository<ClientContact, Long> {
    void deleteAllByContactUid(String contactUid);

    List<ClientContact> findByContactUid(String contactUid);
}
