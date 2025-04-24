package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Debitorka;
import com.pharma.clientapp.repository.DebitorkaRepository;
import com.pharma.clientapp.dto.DebtWithAddressDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Service
public class DebitorkaService {
    private final DebitorkaRepository debitorkaRepository;

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
}
