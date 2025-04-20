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
