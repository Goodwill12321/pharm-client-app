package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Debitorka;
import com.pharma.clientapp.service.DebitorkaService;
import com.pharma.clientapp.dto.DebtWithAddressDto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/debitorka")
public class DebitorkaController {
    private final DebitorkaService debitorkaService;
    private static final Logger logger = LoggerFactory.getLogger(DebitorkaController.class);

    /**
     * Получить все задолженности по docUid
     */
    @GetMapping("/by-doc/{docUid}")
    public List<Debitorka> getDebitorkaByDocUid(@PathVariable String docUid) {
        return debitorkaService.findByDocUid(docUid);
    }

    /**
     * Полная замена всех записей Debitorka по docUid
     */
    @PutMapping("/replace-by-doc/{docUid}")
    public List<Debitorka> replaceAllByDocUid(
            @PathVariable String docUid,
            @RequestBody List<Debitorka> items) {
        return debitorkaService.replaceAllByDocUid(docUid, items);
    }

    public DebitorkaController(DebitorkaService debitorkaService) {
        this.debitorkaService = debitorkaService;
    }

    @GetMapping("/filtered")
    public List<DebtWithAddressDto> getFilteredDebitorka(
            @AuthenticationPrincipal com.pharma.clientapp.entity.Contact contact,
            @RequestParam(value = "addresses", required = false) List<String> addresses
    ) {
        String contactUid = contact != null ? contact.getUid() : null;
        logger.info("contactUid = {}, addresses = {}", contactUid, addresses);
        return debitorkaService.findDebtsForContact(contactUid, addresses);
    }

    @GetMapping
    public List<Debitorka> getAllDebitorka() {
        return debitorkaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Debitorka> getDebitorkaById(@PathVariable Long id) {
        return debitorkaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Debitorka createDebitorka(@RequestBody Debitorka debitorka) {
        return debitorkaService.save(debitorka);
    }

    @GetMapping("/overdue")
    public List<Debitorka> getOverdueDebitorka() {
        return debitorkaService.findOverdue();
    }

    @GetMapping("/overdue/summary")
    public Map<String, Object> getOverdueSummary() {
        int docCount = debitorkaService.countOverdue();
        double sum = debitorkaService.sumOverdue();
        Map<String, Object> result = new HashMap<>();
        result.put("doc_count", docCount);
        result.put("sum", sum);
        return result;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebitorka(@PathVariable Long id) {
        debitorkaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Полная замена всех записей Debitorka по ulUid.
     * @param ulUid UID организации
     * @param items Новый список Debitorka
     * @return сохранённые записи
     */
    @PutMapping("/replace/{ulUid}")
    public List<Debitorka> replaceAllByUlUid(
            @PathVariable String ulUid,
            @RequestBody List<Debitorka> items) {
        return debitorkaService.replaceAllByUlUid(ulUid, items);
    }
}
