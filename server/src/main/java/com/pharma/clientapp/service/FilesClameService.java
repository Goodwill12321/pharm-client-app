package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.FilesClame;
import com.pharma.clientapp.repository.FilesClameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilesClameService {
    private final FilesClameRepository filesClameRepository;

    public FilesClameService(FilesClameRepository filesClameRepository) {
        this.filesClameRepository = filesClameRepository;
    }

    public List<FilesClame> findAll() {
        return filesClameRepository.findAll();
    }

    public Optional<FilesClame> findById(Long id) {
        return filesClameRepository.findById(id);
    }

    public FilesClame save(FilesClame filesClame) {
        return filesClameRepository.save(filesClame);
    }

    public void deleteById(Long id) {
        filesClameRepository.deleteById(id);
    }
}
