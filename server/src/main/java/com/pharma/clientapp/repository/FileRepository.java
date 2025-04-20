package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, String> {
}
