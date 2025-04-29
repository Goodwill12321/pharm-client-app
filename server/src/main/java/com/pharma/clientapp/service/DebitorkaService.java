package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Debitorka;
import com.pharma.clientapp.repository.DebitorkaRepository;
import com.pharma.clientapp.dto.DebtWithAddressDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DebitorkaService {
    /**
     * Полная замена всех записей Debitorka по ulUid.
     * Старые записи удаляются, новые полностью сохраняются.
     * @param ulUid ulUid для замещения
     * @param items новый список
     * @return сохранённые записи
     */
    @Transactional
    public List<Debitorka> replaceAllByUlUid(String ulUid, List<Debitorka> items) {
        debitorkaRepository.deleteAllByUlUid(ulUid);
        for (Debitorka item : items) {
            item.setUlUid(ulUid);
        }
        return debitorkaRepository.saveAll(items);
    }

    private final DebitorkaRepository debitorkaRepository;

    /**
     * Полная замена всех записей Debitorka по docUid.
     * Старые записи удаляются, новые полностью сохраняются.
     * @param docUid docUid для замещения
     * @param items новый список
     * @return сохранённые записи
     */
    @Transactional
    public List<Debitorka> replaceAllByDocUid(String docUid, List<Debitorka> items) {
        debitorkaRepository.deleteAllByDocUid(docUid);
        for (Debitorka item : items) {
            item.setDocUid(docUid);
        }
        return debitorkaRepository.saveAll(items);
    }

    /**
     * Получить все задолженности по docUid
     */
    public List<Debitorka> findByDocUid(String docUid) {
        return debitorkaRepository.findByDocUid(docUid);
    }

    public DebitorkaService(DebitorkaRepository debitorkaRepository) {
        this.debitorkaRepository = debitorkaRepository;
}

    public List<Debitorka> findAll() {
        return debitorkaRepository.findAll();
}

    public Optional<Debitorka> findById(Long id) {
        return debitorkaRepository.findById(id);
}

    public Debitorka save(Debitorka debitorka) {
        return debitorkaRepository.save(debitorka);
}

    public void deleteById(Long id) {
        debitorkaRepository.deleteById(id);
}

    public List<Debitorka> findOverdue() {
        LocalDate today = LocalDate.now();
        return debitorkaRepository.findByPayDateBefore(today);
}

    public int countOverdue() {
        LocalDate today = LocalDate.now();
        return (int) debitorkaRepository.countOverdue(today);
}

    public double sumOverdue() {
        LocalDate today = LocalDate.now();
        Double sum = debitorkaRepository.sumOverdue(today);
        return sum != null ? sum : 0.0;
}
    public List<DebtWithAddressDto> findDebtsForContact(String contactUid, String address) {
        return debitorkaRepository.findDebtsForContact(contactUid, address);
    }

    public List<DebtWithAddressDto> findDebtsForContact(String contactUid, List<String> addresses) {
        if (addresses == null || addresses.isEmpty()) {
            return debitorkaRepository.findDebtsForContact(contactUid, (List<String>) null);
        }
        return debitorkaRepository.findDebtsForContact(contactUid, addresses);
    }
}
