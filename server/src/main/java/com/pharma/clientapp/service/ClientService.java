package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Client;
import com.pharma.clientapp.entity.ClientContact;
import com.pharma.clientapp.repository.ClientContactRepository;
import com.pharma.clientapp.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientContactRepository clientContactRepository;

    public ClientService(ClientRepository clientRepository, ClientContactRepository clientContactRepository) {
        this.clientRepository = clientRepository;
        this.clientContactRepository = clientContactRepository;
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

    public List<Client> findClientsByContactUid(String contactUid) {
        var clientContacts = clientContactRepository.findByContactUid(contactUid);
        var clientUids = clientContacts.stream().map(ClientContact::getClientUid).toList();
        return clientRepository.findAllById(clientUids);
    }
}
