package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClientContact;
import com.pharma.clientapp.repository.ClientContactRepository;
import org.springframework.stereotype.Service;
import com.pharma.clientapp.dto.ClientAddressDto;
import com.pharma.clientapp.repository.ClientRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientContactService {
    /**
     * Полная замена всех записей ClientContact по contactUid.
     * Старые записи удаляются, новые полностью сохраняются.
     * @param contactUid contactUid для замещения
     * @param contacts новый список
     * @return сохранённые записи
     */
    @Transactional
    public List<ClientContact> replaceAllByContactUid(String contactUid, List<ClientContact> contacts) {
        clientContactRepository.deleteAllByContactUid(contactUid);
        for (ClientContact contact : contacts) {
            contact.setContactUid(contactUid);
        }
        return clientContactRepository.saveAll(contacts);
    }

    private final ClientContactRepository clientContactRepository;
    private final ClientRepository clientRepository;

    public ClientContactService(ClientContactRepository clientContactRepository, ClientRepository clientRepository) {
        this.clientContactRepository = clientContactRepository;
        this.clientRepository = clientRepository;
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

    public List<ClientAddressDto> getAvailableAddresses(String contactUid) {
        return clientRepository.findAvailableAddressesByContactUid(contactUid);
    }
}
