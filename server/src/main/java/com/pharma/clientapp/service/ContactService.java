package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.repository.ContactRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ContactService {
    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);
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
        if (contact.getPassword() != null //&& !contact.getPassword().startsWith("$2a$")) 
        )
        {   logger.info("### Encoding password for contact: {} ###", contact.getName());
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            contact.setPassword(encoder.encode(contact.getPassword()));
        }
        return contactRepository.save(contact);
    }

    public void deleteById(String uid) {
        contactRepository.deleteById(uid);
    }
}
