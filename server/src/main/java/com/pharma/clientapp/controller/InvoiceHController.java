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
    private final com.pharma.clientapp.service.ClientContactService clientContactService;

    public InvoiceHController(InvoiceHService invoiceHService, com.pharma.clientapp.service.ClientContactService clientContactService) {
        this.invoiceHService = invoiceHService;
        this.clientContactService = clientContactService;
    }



    @GetMapping
    public List<InvoiceH> getAllInvoiceH() {
        return invoiceHService.findAll();
    }

    // Единый эндпоинт: фильтрация по доступным client_uid, возвращает список InvoiceHFilteredDto (DTO только во внутренней структуре)
    @GetMapping("/filtered")
    public List<com.pharma.clientapp.dto.InvoiceHFilteredDto> getFilteredInvoiceH(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.pharma.clientapp.entity.Contact contact,
            @RequestParam(value = "clientUids", required = false) List<String> clientUids,
            @RequestParam(value = "dateFrom", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate dateTo
    ) {
        String contactUid = contact != null ? contact.getUid() : null;
        return invoiceHService.findFilteredForContact(contactUid, clientUids, dateFrom, dateTo);
    }

    @GetMapping("/{uid}")
    public ResponseEntity<InvoiceH> getInvoiceHById(@PathVariable String uid) {
        return invoiceHService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    /**
 * Добавляет новый InvoiceH или обновляет существующий по uid (upsert).
 * Если uid уже есть в базе — запись обновляется, иначе создается новая.
 */
public InvoiceH upsertInvoiceH(@RequestBody InvoiceH invoiceH) {
        return invoiceHService.save(invoiceH);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteInvoiceH(@PathVariable String uid) {
        invoiceHService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
