package com.pharma.clientapp.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pharma.clientapp.dto.ClaimAttachmentDto;
import com.pharma.clientapp.dto.PresignedUrlResponse;
import com.pharma.clientapp.service.ClaimAttachmentService;

@RestController
@RequestMapping("/api/claims/{claimUid}/attachments")
public class ClaimAttachmentController {

    private final ClaimAttachmentService service;

    public ClaimAttachmentController(ClaimAttachmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClaimAttachmentDto> list(@PathVariable String claimUid) {
        return service.list(claimUid);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ClaimAttachmentDto upload(
            @PathVariable String claimUid,
            @RequestPart("file") MultipartFile file) throws IOException {
        return service.upload(claimUid, file);
    }

    @DeleteMapping("/{fileUid}")
    public ResponseEntity<Void> delete(@PathVariable String claimUid, @PathVariable String fileUid) {
        service.delete(claimUid, fileUid);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{fileUid}/download-url")
    public PresignedUrlResponse getDownloadUrl(@PathVariable String claimUid, @PathVariable String fileUid) {
        return new PresignedUrlResponse(service.getDownloadUrl(claimUid, fileUid));
    }
}
