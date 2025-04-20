package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClientContact;
import com.pharma.clientapp.repository.ClientContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientContactService {
    private final ClientContactRepository clientContactRepository;

    public ClientContactService(ClientContactRepository clientContactRepository) {
        this.clientContactRepository = clientContactRepository;
    }

    public List<ClientContact> findAll() {
        return clientContactRepository.findAll();
    }

    public Optional<ClientContact> findById(Long id) {
        return clientContactRepository.findById(id);
    }

    public ClientContact save(ClientContact clientContact) {
        return clientContactRepository.save(clientContact);
    }

    public void deleteById(Long id) {
        clientContactRepository.deleteById(id);
    }
}
