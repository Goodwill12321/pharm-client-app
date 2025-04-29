package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.ClientManager;
import com.pharma.clientapp.service.ClientManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientmanager")
public class ClientManagerController {
    private final ClientManagerService clientManagerService;

    public ClientManagerController(ClientManagerService clientManagerService) {
        this.clientManagerService = clientManagerService;
    }

    @GetMapping
    public List<ClientManager> getAllClientManager() {
        return clientManagerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientManager> getClientManagerById(@PathVariable Long id) {
        return clientManagerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ClientManager createClientManager(@RequestBody ClientManager clientManager) {
        return clientManagerService.save(clientManager);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClientManager(@PathVariable Long id) {
        clientManagerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Полная замена всех записей ClientManager по clientUid.
     * @param clientUid UID клиента
     * @param managers Новый список ClientManager
     * @return сохранённые записи
     */
    @PutMapping("/replace/{clientUid}")
    public List<ClientManager> replaceAllByClientUid(
            @PathVariable String clientUid,
            @RequestBody List<ClientManager> managers) {
        return clientManagerService.replaceAllByClientUid(clientUid, managers);
    }
}
