package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClientManager;
import com.pharma.clientapp.repository.ClientManagerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientManagerService {
    /**
     * Полная замена всех записей ClientManager по clientUid.
     * Старые записи удаляются, новые полностью сохраняются.
     * @param clientUid clientUid для замещения
     * @param managers новый список
     * @return сохранённые записи
     */
    public List<ClientManager> replaceAllByClientUid(String clientUid, List<ClientManager> managers) {
        clientManagerRepository.deleteAllByClientUid(clientUid);
        for (ClientManager manager : managers) {
            manager.setClientUid(clientUid);
        }
        return clientManagerRepository.saveAll(managers);
    }

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
