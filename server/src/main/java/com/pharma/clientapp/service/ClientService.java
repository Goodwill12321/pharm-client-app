package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Client;
import com.pharma.clientapp.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Optional<Client> findById(String uid) {
        return clientRepository.findById(uid);
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public void deleteById(String uid) {
        clientRepository.deleteById(uid);
    }
}
