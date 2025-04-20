package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, String> {
}
