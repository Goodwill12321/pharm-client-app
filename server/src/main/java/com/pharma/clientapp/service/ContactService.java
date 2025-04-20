package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    public Optional<Contact> findById(String uid) {
        return contactRepository.findById(uid);
    }

    public Contact save(Contact contact) {
        return contactRepository.save(contact);
    }

    public void deleteById(String uid) {
        contactRepository.deleteById(uid);
    }
}
