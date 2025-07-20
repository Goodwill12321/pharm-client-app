package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.ClientAddressDto;
import com.pharma.clientapp.entity.ClientContact;
import com.pharma.clientapp.service.ClientContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.pharma.clientapp.entity.Contact;
import java.util.Optional;
import java.util.Map;

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
    public ResponseEntity<?> create(@RequestBody ClientContact dto) {
        Optional<ClientContact> existing = clientContactService.findByClientUidAndContactUid(dto.getClientUid(), dto.getContactUid());
        if (existing.isPresent()) {
            // Возвращаем OK и id существующей записи в JSON формате
            return ResponseEntity.ok(Map.of("uid", existing.get().getUid()));
        }
        ClientContact saved = clientContactService.save(dto);
        return ResponseEntity.status(201).body(Map.of("uid", saved.getUid()));
    }

    // Новый эндпойнт для поиска id по паре clientUid и contactUid
    @GetMapping("/find")
    public ResponseEntity<?> findId(@RequestParam String clientUid, @RequestParam String contactUid) {
        Optional<ClientContact> existing = clientContactService.findByClientUidAndContactUid(clientUid, contactUid);
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of("uid", existing.get().getUid()));
        } else {
            return ResponseEntity.noContent().build();
        }
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

    /**
     * Полная замена всех записей ClientContact по contactUid.
     * @param contactUid UID контакта
     * @param contacts Новый список ClientContact
     * @return сохранённые записи
     */
    @PutMapping("/replace/{contactUid}")
    public List<ClientContact> replaceAllByContactUid(
            @PathVariable String contactUid,
            @RequestBody List<ClientContact> contacts) {
        return clientContactService.replaceAllByContactUid(contactUid, contacts);
    }
}
