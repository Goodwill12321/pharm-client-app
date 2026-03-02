package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.DocUnloadTaskBatchUpdateStatusRequest;
import com.pharma.clientapp.dto.DocUnloadTaskCreateRequest;
import com.pharma.clientapp.dto.DocUnloadTaskSummaryDto;
import com.pharma.clientapp.dto.DocUnloadTaskUpdateStatusRequest;
import com.pharma.clientapp.dto.DocUnloadTaskViewDto;
import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.entity.DocUnloadTask;
import com.pharma.clientapp.service.DocUnloadTaskService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doc-unload-tasks")
public class DocUnloadTaskController {
    private final DocUnloadTaskService service;

    public DocUnloadTaskController(DocUnloadTaskService service) {
        this.service = service;
    }

    @PostMapping
    public DocUnloadTask create(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @RequestBody DocUnloadTaskCreateRequest req
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        try {
            return service.create(contact, req);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    @PostMapping("/{uid}/mark-deleted")
    public DocUnloadTask markDeleted(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @PathVariable String uid
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        try {
            return service.markDeleted(uid, contact);
        } catch (SecurityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping
    public List<DocUnloadTaskViewDto> list(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @RequestParam(value = "contactUid", required = false) String contactUid,
        @RequestParam(value = "docUid", required = false) String docUid,
        @RequestParam(value = "docNum", required = false) String docNum,
        @RequestParam(value = "requestFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestFrom,
        @RequestParam(value = "requestTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestTo
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        String effectiveContactUid = contact != null ? contact.getUid() : null;
        if (contactUid != null && contact != null && "exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            effectiveContactUid = contactUid;
        }
        return service.listFilteredView(effectiveContactUid, docUid, docNum, requestFrom, requestTo);
    }

    @GetMapping("/history/by-doc/{docUid}")
    public List<DocUnloadTaskViewDto> historyByDoc(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @PathVariable String docUid,
        @RequestParam(value = "contactUid", required = false) String contactUid
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        String effectiveContactUid = contact.getUid();
        if (contactUid != null && "exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            effectiveContactUid = contactUid;
        }
        return service.getHistoryViewByDocUidForContact(docUid, effectiveContactUid);
    }

    @GetMapping("/pending")
    public List<DocUnloadTaskViewDto> pendingAllContacts(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @RequestParam(value = "requestFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestFrom,
        @RequestParam(value = "requestTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestTo
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (!"exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return service.listPendingAllContactsView(requestFrom, requestTo);
    }

    @PostMapping("/{uid}/update-status")
    public DocUnloadTask updateStatus(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @PathVariable String uid,
        @RequestBody DocUnloadTaskUpdateStatusRequest req
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (!"exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return service.updateStatus(uid, req);
    }

    @PostMapping("/batch-update-status")
    public Map<String, DocUnloadTask> batchUpdateStatus(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @RequestBody DocUnloadTaskBatchUpdateStatusRequest req
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (!"exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return service.batchUpdateStatus(req);
    }

    @GetMapping("/summary/by-doc-uids")
    public List<DocUnloadTaskSummaryDto> summaryByDocUids(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact,
        @RequestParam(value = "docUids") List<String> docUids,
        @RequestParam(value = "contactUid", required = false) String contactUid
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        String effectiveContactUid = contact.getUid();
        if ("exchange_1c".equalsIgnoreCase(contact.getLogin())) {
            effectiveContactUid = contactUid;
        }
        return service.getSummaryByDocUids(docUids, effectiveContactUid);
    }

    @GetMapping("/summary/by-contact")
    public List<DocUnloadTaskSummaryDto> summaryByContact(
        @org.springframework.security.core.annotation.AuthenticationPrincipal Contact contact
    ) {
        if (contact == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return service.getSummaryByContactUid(contact.getUid());
    }
}
