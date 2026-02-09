package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ClameH;
import com.pharma.clientapp.repository.ClameHRepository;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClameHService {
    private final ClameHRepository clameHRepository;
    private final Object codeLock = new Object();

    public ClameHService(ClameHRepository clameHRepository) {
        this.clameHRepository = clameHRepository;
    }

    public List<ClameH> findAll() {
        return clameHRepository.findAll();
    }

    public Optional<ClameH> findById(String uid) {
        return clameHRepository.findById(uid);
    }

    @Transactional
    public ClameH save(ClameH clameH) {
        if (clameH.getUid() == null && (clameH.getCode() == null || clameH.getCode().isBlank())) {
            synchronized (codeLock) {
                Integer max = clameHRepository.findMaxNumericCode();
                int next = (max == null ? 0 : max) + 1;
                clameH.setCode(String.valueOf(next));
            }
        }
        return clameHRepository.save(clameH);
    }

    @Transactional
    public Optional<ClameH> update(String uid, ClameH patch) {
        return clameHRepository.findById(uid).map(existing -> {
            if (patch.getComment() != null) existing.setComment(patch.getComment());
            if (patch.getStatus() != null) existing.setStatus(patch.getStatus());
            if (patch.getUidDocOsn() != null) existing.setUidDocOsn(patch.getUidDocOsn());
            if (patch.getDocNum() != null) existing.setDocNum(patch.getDocNum());
            if (patch.getDocDate() != null) existing.setDocDate(patch.getDocDate());
            if (patch.getClientUid() != null) existing.setClientUid(patch.getClientUid());
            if (patch.getIsDel() != null) existing.setIsDel(patch.getIsDel());
            return clameHRepository.save(existing);
        });
    }

    @Transactional
    public Optional<ClameH> update(ClameH clameH) {
        return clameHRepository.findById(clameH.getUid()).map(existing -> {
            existing.setComment(clameH.getComment());
            existing.setStatus(clameH.getStatus());
            existing.setUidDocOsn(clameH.getUidDocOsn());
            existing.setDocNum(clameH.getDocNum());
            existing.setDocDate(clameH.getDocDate());
            existing.setClientUid(clameH.getClientUid());
            existing.setIsDel(clameH.getIsDel());
            return clameHRepository.save(existing);
        });
    }

    public void deleteById(String uid) {
        clameHRepository.deleteById(uid);
    }
}
