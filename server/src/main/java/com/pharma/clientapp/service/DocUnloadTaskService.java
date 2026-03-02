package com.pharma.clientapp.service;

import com.pharma.clientapp.dto.DocUnloadTaskBatchUpdateStatusRequest;
import com.pharma.clientapp.dto.DocUnloadTaskCreateRequest;
import com.pharma.clientapp.dto.DocUnloadTaskSummaryDto;
import com.pharma.clientapp.dto.DocUnloadTaskUpdateStatusRequest;
import com.pharma.clientapp.dto.DocUnloadTaskViewDto;
import com.pharma.clientapp.dto.DocUnloadTaskViewProjection;
import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.entity.DocUnloadTask;
import com.pharma.clientapp.repository.DocUnloadTaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocUnloadTaskService {
    private final DocUnloadTaskRepository repository;

    public DocUnloadTaskService(DocUnloadTaskRepository repository) {
        this.repository = repository;
    }

    public DocUnloadTask create(Contact contact, DocUnloadTaskCreateRequest req) {
        if (req == null || req.getDocUid() == null) {
            throw new IllegalArgumentException("docUid is required");
        }
        if (repository.existsByDocUidAndContactUidAndIsDelFalseAndIsUnloadedFalse(req.getDocUid(), contact.getUid())) {
            throw new IllegalStateException("Pending unload task already exists");
        }
        DocUnloadTask t = new DocUnloadTask();
        t.setContactUid(contact.getUid());
        t.setDocType(req.getDocType() != null ? req.getDocType() : "Электронная накладная");
        t.setDocUid(req.getDocUid());
        t.setDocNum(req.getDocNum());
        t.setDocDate(req.getDocDate());
        t.setIsUnloaded(false);
        t.setIsDel(false);
        return repository.save(t);
    }

    public DocUnloadTask getByUid(String uid) {
        return repository.findById(uid).orElseThrow();
    }

    @Transactional
    public DocUnloadTask markDeleted(String uid, Contact actor) {
        DocUnloadTask t = repository.findById(uid).orElseThrow();

        boolean isExchange = actor != null && actor.getLogin() != null && "exchange_1c".equalsIgnoreCase(actor.getLogin());
        boolean isOwner = actor != null && actor.getUid() != null && actor.getUid().equals(t.getContactUid());

        if (!isExchange && !isOwner) {
            throw new SecurityException("Forbidden");
        }

        t.setIsDel(true);
        return repository.save(t);
    }

    public List<DocUnloadTask> getHistoryByDocUidForContact(String docUid, String contactUid) {
        return repository.findByDocUidAndContactUidAndIsDelFalseOrderByRequestTimeDesc(docUid, contactUid);
    }

    public List<DocUnloadTaskViewDto> getHistoryViewByDocUidForContact(String docUid, String contactUid) {
        return repository.findHistoryViewByDocUidForContact(docUid, contactUid);
    }

    public List<DocUnloadTask> listFiltered(String contactUid, String docUid, String docNum, LocalDate requestFrom, LocalDate requestTo) {
        LocalDateTime from = requestFrom != null ? requestFrom.atStartOfDay() : null;
        LocalDateTime to = requestTo != null ? requestTo.plusDays(1).atStartOfDay() : null;
        String docNumLower = (docNum != null) ? docNum.toLowerCase() : null;
        return repository.findFiltered(contactUid, docUid, docNum, docNumLower, from, to);
    }

    public List<DocUnloadTaskViewDto> listFilteredView(String contactUid, String docUid, String docNum, LocalDate requestFrom, LocalDate requestTo) {
        LocalDateTime from = requestFrom != null ? requestFrom.atStartOfDay() : null;
        LocalDateTime to = requestTo != null ? requestTo.plusDays(1).atStartOfDay() : null;
        String docNumLower = (docNum != null) ? docNum.toLowerCase() : null;
        List<DocUnloadTaskViewProjection> projections = repository.findFilteredView(contactUid, docUid, docNum, docNumLower, from, to);
        return projections.stream()
            .map(p -> new DocUnloadTaskViewDto(
                p.getUid(),
                p.getRequestTime(),
                p.getContactUid(),
                p.getContactName(),
                p.getDocType(),
                p.getDocUid(),
                p.getDocnum(),
                p.getDocdate(),
                p.getIsUnloaded(),
                p.getUnloadTime(),
                p.getStatusUpdateTime(),
                p.getUnloadComment(),
                p.getIsDel()
            ))
            .toList();
    }

    public List<DocUnloadTask> listPendingAllContacts(LocalDate requestFrom, LocalDate requestTo) {
        LocalDateTime from = requestFrom != null ? requestFrom.atStartOfDay() : null;
        LocalDateTime to = requestTo != null ? requestTo.plusDays(1).atStartOfDay() : null;
        return repository.findPendingAllContacts(from, to);
    }

    public List<DocUnloadTaskViewDto> listPendingAllContactsView(LocalDate requestFrom, LocalDate requestTo) {
        LocalDateTime from = requestFrom != null ? requestFrom.atStartOfDay() : null;
        LocalDateTime to = requestTo != null ? requestTo.plusDays(1).atStartOfDay() : null;
        return repository.findPendingAllContactsView(from, to);
    }

    @Transactional
    public DocUnloadTask updateStatus(String uid, DocUnloadTaskUpdateStatusRequest req) {
        DocUnloadTask t = repository.findById(uid).orElseThrow();
        if (req.getIsUnloaded() != null) {
            t.setIsUnloaded(req.getIsUnloaded());
        }
        t.setUnloadTime(req.getUnloadTime());
        t.setUnloadComment(req.getUnloadComment());
        t.setStatusUpdateTime(LocalDateTime.now());
        return repository.save(t);
    }

    @Transactional
    public Map<String, DocUnloadTask> batchUpdateStatus(DocUnloadTaskBatchUpdateStatusRequest req) {
        Map<String, DocUnloadTask> result = new HashMap<>();
        if (req == null || req.getItems() == null) {
            return result;
        }
        for (DocUnloadTaskBatchUpdateStatusRequest.DocUnloadTaskBatchUpdateStatusItem item : req.getItems()) {
            if (item == null || item.getUid() == null) {
                continue;
            }
            DocUnloadTask t = repository.findById(item.getUid()).orElse(null);
            if (t == null) {
                continue;
            }
            if (item.getIsUnloaded() != null) {
                t.setIsUnloaded(item.getIsUnloaded());
            }
            t.setUnloadTime(item.getUnloadTime());
            t.setUnloadComment(item.getUnloadComment());
            t.setStatusUpdateTime(LocalDateTime.now());
            result.put(item.getUid(), repository.save(t));
        }
        return result;
    }

    public List<DocUnloadTaskSummaryDto> getSummaryByDocUids(List<String> docUids, String contactUid) {
        if (docUids == null || docUids.isEmpty()) {
            return List.of();
        }
        return repository.getSummaryByDocUids(docUids, contactUid);
    }

    public List<DocUnloadTaskSummaryDto> getSummaryByContactUid(String contactUid) {
        return repository.getSummaryByContactUid(contactUid);
    }
}
