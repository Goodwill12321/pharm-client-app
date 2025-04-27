package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.InvoiceT;
import com.pharma.clientapp.repository.InvoiceTRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceTService {
    private final InvoiceTRepository invoiceTRepository;

    public InvoiceTService(InvoiceTRepository invoiceTRepository) {
        this.invoiceTRepository = invoiceTRepository;
    }

    public List<InvoiceT> findAll() {
        return invoiceTRepository.findAll();
    }

    public List<InvoiceT> findByUid(String uid) {
        return invoiceTRepository.findByUid(uid);
    }

    public java.util.List<com.pharma.clientapp.dto.InvoiceTWithNamesDto> findWithNamesByUid(String uid) {
        java.util.List<com.pharma.clientapp.dto.InvoiceTWithNamesDto> list = invoiceTRepository.findWithNamesByUid(uid);
        list.sort(java.util.Comparator.comparing(com.pharma.clientapp.dto.InvoiceTWithNamesDto::getUidLine, java.util.Comparator.nullsLast(String::compareTo)));
        return list;
    }

    public Optional<InvoiceT> findById(String uidLine) {
        return invoiceTRepository.findById(uidLine);
    }

    public InvoiceT save(InvoiceT invoiceT) {
        return invoiceTRepository.save(invoiceT);
    }

    public void deleteById(String uidLine) {
        invoiceTRepository.deleteById(uidLine);
    }
}
