package com.pharma.clientapp.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.pharma.clientapp.dto.ClaimAttachmentDto;
import com.pharma.clientapp.entity.ClameH;
import com.pharma.clientapp.entity.File;
import com.pharma.clientapp.entity.FilesClame;
import com.pharma.clientapp.repository.ClameHRepository;
import com.pharma.clientapp.repository.FileRepository;
import com.pharma.clientapp.repository.FilesClameRepository;
import com.pharma.clientapp.storage.S3StorageService;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClaimAttachmentService {

    private final ClameHRepository clameHRepository;
    private final FileRepository fileRepository;
    private final FilesClameRepository filesClameRepository;
    private final S3StorageService storage;

    public ClaimAttachmentService(
            ClameHRepository clameHRepository,
            FileRepository fileRepository,
            FilesClameRepository filesClameRepository,
            S3StorageService storage) {
        this.clameHRepository = clameHRepository;
        this.fileRepository = fileRepository;
        this.filesClameRepository = filesClameRepository;
        this.storage = storage;
    }

    public List<ClaimAttachmentDto> list(String claimUid) {
        List<String> uids = filesClameRepository.findFileUidsByClaimUid(claimUid);
        if (uids.isEmpty()) {
            return List.of();
        }

        List<File> files = fileRepository.findAllById(uids);
        List<ClaimAttachmentDto> dtos = new ArrayList<>(files.size());
        for (File f : files) {
            dtos.add(toDto(f));
        }
        return dtos;
    }

    @Transactional
    public ClaimAttachmentDto upload(String claimUid, MultipartFile multipartFile) throws IOException {
        ClameH claim = clameHRepository.findById(claimUid)
                .orElseThrow(() -> new EntityNotFoundException("Claim not found"));

        String docNum = claim.getDocNum();
        if (docNum == null || docNum.isBlank()) {
            throw new IllegalArgumentException("Claim docNum is required");
        }

        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String originalName = sanitizeFileName(multipartFile.getOriginalFilename());
        if (originalName.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }

        if (filesClameRepository.existsByClaimUidAndFileName(claimUid, originalName)) {
            throw new IllegalArgumentException("Файл с таким именем уже прикреплён к претензии");
        }

        long size = multipartFile.getSize();
        if (size <= 0) {
            throw new IllegalArgumentException("Empty file");
        }

        String key = "Claims/" + docNum + "/" + originalName;

        storage.putObject(key, multipartFile.getContentType(), size, multipartFile.getInputStream());

        try {
            File file = new File();
            file.setFileName(originalName);
            file.setFilePath(key);
            file.setContentType(multipartFile.getContentType());
            file.setSizeBytes(size);
            File saved = fileRepository.save(file);

            FilesClame link = new FilesClame();
            link.setUidClame(claimUid);
            link.setUidFile(saved.getUid());
            filesClameRepository.save(link);

            return toDto(saved);
        } catch (RuntimeException e) {
            storage.deleteObject(key);
            throw e;
        }
    }

    @Transactional
    public void delete(String claimUid, String fileUid) {
        FilesClame link = filesClameRepository.findByUidClameAndUidFile(claimUid, fileUid)
                .orElseThrow(() -> new EntityNotFoundException("Attachment link not found"));

        File file = fileRepository.findById(fileUid)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));

        filesClameRepository.delete(link);

        long linksLeft = filesClameRepository.countByUidFile(fileUid);
        if (linksLeft > 0) {
            return;
        }

        if (file.getFilePath() != null && !file.getFilePath().isBlank()) {
            storage.deleteObject(file.getFilePath());
        }

        fileRepository.delete(file);
    }

    public String getDownloadUrl(String claimUid, String fileUid) {
        boolean linked = filesClameRepository.findByUidClameAndUidFile(claimUid, fileUid).isPresent();
        if (!linked) {
            throw new EntityNotFoundException("Attachment link not found");
        }

        File file = fileRepository.findById(fileUid)
                .orElseThrow(() -> new EntityNotFoundException("File not found"));

        if (file.getFilePath() == null || file.getFilePath().isBlank()) {
            throw new IllegalArgumentException("FilePath is empty");
        }

        return storage.createPresignedGetUrl(file.getFilePath());
    }

    private ClaimAttachmentDto toDto(File f) {
        return new ClaimAttachmentDto(
                f.getUid(),
                f.getFileName(),
                f.getContentType(),
                f.getSizeBytes(),
                f.getCreateTime());
    }

    private String sanitizeFileName(String name) {
        if (name == null) {
            return "";
        }
        String v = name.trim();
        v = v.replace("\\\\", "/");
        int slash = v.lastIndexOf('/');
        if (slash >= 0) {
            v = v.substring(slash + 1);
        }
        v = v.replace("..", ".");
        v = v.replaceAll("[\\r\\n]", "");
        return v;
    }
}
