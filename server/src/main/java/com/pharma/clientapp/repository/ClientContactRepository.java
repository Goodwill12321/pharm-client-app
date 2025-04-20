package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.ClientContact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientContactRepository extends JpaRepository<ClientContact, Long> {
}
