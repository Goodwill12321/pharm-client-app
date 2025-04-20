package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.ResultClaim;
import com.pharma.clientapp.service.ResultClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resultclaim")
public class ResultClaimController {
    private final ResultClaimService resultClaimService;

    public ResultClaimController(ResultClaimService resultClaimService) {
        this.resultClaimService = resultClaimService;
    }

    @GetMapping
    public List<ResultClaim> getAllResultClaim() {
        return resultClaimService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<ResultClaim> getResultClaimById(@PathVariable String uid) {
        return resultClaimService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResultClaim createResultClaim(@RequestBody ResultClaim resultClaim) {
        return resultClaimService.save(resultClaim);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteResultClaim(@PathVariable String uid) {
        resultClaimService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
