package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.ResultClaim;
import com.pharma.clientapp.repository.ResultClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResultClaimService {
    private final ResultClaimRepository resultClaimRepository;

    public ResultClaimService(ResultClaimRepository resultClaimRepository) {
        this.resultClaimRepository = resultClaimRepository;
    }

    public List<ResultClaim> findAll() {
        return resultClaimRepository.findAll();
    }

    public Optional<ResultClaim> findById(String uid) {
        return resultClaimRepository.findById(uid);
    }

    public ResultClaim save(ResultClaim resultClaim) {
        return resultClaimRepository.save(resultClaim);
    }

    public void deleteById(String uid) {
        resultClaimRepository.deleteById(uid);
    }
}
