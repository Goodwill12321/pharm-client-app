package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClientManager;
import com.pharma.clientapp.repository.ClientManagerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientManagerService {
    private final ClientManagerRepository clientManagerRepository;

    public ClientManagerService(ClientManagerRepository clientManagerRepository) {
        this.clientManagerRepository = clientManagerRepository;
    }

    public List<ClientManager> findAll() {
        return clientManagerRepository.findAll();
    }

    public Optional<ClientManager> findById(Long id) {
        return clientManagerRepository.findById(id);
    }

    public ClientManager save(ClientManager clientManager) {
        return clientManagerRepository.save(clientManager);
    }

    public void deleteById(Long id) {
        clientManagerRepository.deleteById(id);
    }
}
