package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.File;
import com.pharma.clientapp.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    @Autowired
    private FileRepository fileRepository;

    public List<File> findAll() {
        return fileRepository.findAll();
    }

    public Optional<File> findById(String uid) {
        return fileRepository.findById(uid);
    }

    public File save(File file) {
        return fileRepository.save(file);
    }

    public void deleteById(String uid) {
        fileRepository.deleteById(uid);
    }
}
