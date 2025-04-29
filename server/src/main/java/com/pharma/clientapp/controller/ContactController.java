package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<Contact> getAllContacts() {
        return contactService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Contact> getContactById(@PathVariable String uid) {
        return contactService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
 * Добавляет новый контакт или обновляет существующий по uid (upsert).
 * Если uid уже есть в базе — запись обновляется, иначе создается новая.
 */
public Contact upsertContact(@RequestBody Contact contact) {
        return contactService.save(contact);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteContact(@PathVariable String uid) {
        contactService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
