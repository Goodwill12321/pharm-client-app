package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.InvoiceH;
import com.pharma.clientapp.repository.InvoiceHRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceHService {
    private final InvoiceHRepository invoiceHRepository;

    public InvoiceHService(InvoiceHRepository invoiceHRepository) {
        this.invoiceHRepository = invoiceHRepository;
    }

    public List<InvoiceH> findAll() {
        return invoiceHRepository.findAll();
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
