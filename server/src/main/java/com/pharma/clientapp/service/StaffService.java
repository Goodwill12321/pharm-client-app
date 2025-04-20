package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Staff;
import com.pharma.clientapp.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {
    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    public List<Staff> findAll() {
        return staffRepository.findAll();
    }

    public Optional<Staff> findById(String uid) {
        return staffRepository.findById(uid);
    }

    public Staff save(Staff staff) {
        return staffRepository.save(staff);
    }

    public void deleteById(String uid) {
        staffRepository.deleteById(uid);
    }
}
