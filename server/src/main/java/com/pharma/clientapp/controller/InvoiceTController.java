package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.InvoiceT;
import com.pharma.clientapp.service.InvoiceTService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoicet")
public class InvoiceTController {
    private final InvoiceTService invoiceTService;

    public InvoiceTController(InvoiceTService invoiceTService) {
        this.invoiceTService = invoiceTService;
    }

    @GetMapping
    public List<InvoiceT> getAllInvoiceT() {
        return invoiceTService.findAll();
    }

    // Эндпоинт: получить строки по UID документа (шапки) с наименованиями справочников
    @GetMapping("/by-uid/{uid}")
    public List<com.pharma.clientapp.dto.InvoiceTWithNamesDto> getInvoiceTByUid(@PathVariable String uid) {
        return invoiceTService.findWithNamesByUid(uid);
    }

    @GetMapping("/{uidLine}")
    public ResponseEntity<InvoiceT> getInvoiceTById(@PathVariable String uidLine) {
        return invoiceTService.findById(uidLine)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
 * Добавляет новую строку InvoiceT или обновляет существующую по uidLine (upsert).
 * Если uidLine уже есть в базе — запись обновляется, иначе создается новая.
 */
public InvoiceT upsertInvoiceT(@RequestBody InvoiceT invoiceT) {
        return invoiceTService.save(invoiceT);
    }

    @DeleteMapping("/{uidLine}")
    public ResponseEntity<Void> deleteInvoiceT(@PathVariable String uidLine) {
        invoiceTService.deleteById(uidLine);
        return ResponseEntity.noContent().build();
    }
}
