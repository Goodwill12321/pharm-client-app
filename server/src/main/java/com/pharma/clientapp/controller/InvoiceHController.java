package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.InvoiceH;
import com.pharma.clientapp.service.InvoiceHService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoiceh")
public class InvoiceHController {
    private final InvoiceHService invoiceHService;

    public InvoiceHController(InvoiceHService invoiceHService) {
        this.invoiceHService = invoiceHService;
    }

    @GetMapping
    public List<InvoiceH> getAllInvoiceH() {
        return invoiceHService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<InvoiceH> getInvoiceHById(@PathVariable String uid) {
        return invoiceHService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InvoiceH createInvoiceH(@RequestBody InvoiceH invoiceH) {
        return invoiceHService.save(invoiceH);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteInvoiceH(@PathVariable String uid) {
        invoiceHService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
