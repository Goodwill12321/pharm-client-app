package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.ClientAddressDto;
import com.pharma.clientapp.entity.ClientContact;
import com.pharma.clientapp.service.ClientContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.pharma.clientapp.entity.Contact;

@RestController
@RequestMapping("/api/client-contacts")
public class ClientContactController {
    private final ClientContactService clientContactService;

    public ClientContactController(ClientContactService clientContactService) {
        this.clientContactService = clientContactService;
    }

    @GetMapping
    public List<ClientContact> getAllClientContact() {
        return clientContactService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientContact> getClientContactById(@PathVariable Long id) {
        return clientContactService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClientContact createClientContact(@RequestBody ClientContact clientContact) {
        return clientContactService.save(clientContact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClientContact(@PathVariable Long id) {
        clientContactService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Новый эндпойнт: все доступные адреса (клиенты) для текущего контакта
    @GetMapping("/available-addresses")
    public List<ClientAddressDto> getAvailableAddresses(@AuthenticationPrincipal Contact contact) {
        String contactUid = contact != null ? contact.getUid() : null;
        return clientContactService.getAvailableAddresses(contactUid);
    }
}
