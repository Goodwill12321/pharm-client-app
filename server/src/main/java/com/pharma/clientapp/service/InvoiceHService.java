package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.InvoiceH;
import com.pharma.clientapp.repository.InvoiceHRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceHService {
    private final com.pharma.clientapp.service.ClientContactService clientContactService;
    private final InvoiceHRepository invoiceHRepository;

    public InvoiceHService(InvoiceHRepository invoiceHRepository, com.pharma.clientapp.service.ClientContactService clientContactService) {
        this.invoiceHRepository = invoiceHRepository;
        this.clientContactService = clientContactService;
    }

    public List<InvoiceH> findAll() {
        return invoiceHRepository.findAll();
    }

    public List<com.pharma.clientapp.dto.InvoiceHFilteredDto> findFilteredForContact(String contactUid, List<String> clientUids, java.time.LocalDate dateFrom, java.time.LocalDate dateTo) {
        List<String> allowedClients = clientUids;
        if (allowedClients == null || allowedClients.isEmpty()) {
            allowedClients = clientContactService.getAvailableAddresses(contactUid)
                .stream().map(com.pharma.clientapp.dto.ClientAddressDto::getId).toList();
        }
        // Дата по умолчанию: последние 7 дней
        if (dateFrom == null || dateTo == null) {
            dateTo = java.time.LocalDate.now();
            dateFrom = dateTo.minusDays(6);
        }
        java.time.LocalDateTime dateFromDT = dateFrom.atStartOfDay();
        java.time.LocalDateTime dateToDT = dateTo.plusDays(1).atStartOfDay();
        List<com.pharma.clientapp.dto.InvoiceHFilteredDto> list = invoiceHRepository.findFilteredDtoByClientUidsAndDates(allowedClients, dateFromDT, dateToDT);
list.sort(java.util.Comparator.comparing(com.pharma.clientapp.dto.InvoiceHFilteredDto::getDocDate, java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder()))
        .thenComparing(com.pharma.clientapp.dto.InvoiceHFilteredDto::getDocNum, java.util.Comparator.nullsLast(String::compareTo)));
return list;
    }

    public Optional<InvoiceH> findById(String uid) {
        return invoiceHRepository.findById(uid);
    }

    public InvoiceH save(InvoiceH invoiceH) {
        return invoiceHRepository.save(invoiceH);
    }

    public void deleteById(String uid) {
        invoiceHRepository.deleteById(uid);
    }
}
