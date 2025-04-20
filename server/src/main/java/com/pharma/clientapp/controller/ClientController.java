package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Client;
import com.pharma.clientapp.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Client> getClientById(@PathVariable String uid) {
        return clientService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.save(client);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteClient(@PathVariable String uid) {
        clientService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
