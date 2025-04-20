package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Staff;
import com.pharma.clientapp.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Staff> getStaffById(@PathVariable String uid) {
        return staffService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Staff createStaff(@RequestBody Staff staff) {
        return staffService.save(staff);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteStaff(@PathVariable String uid) {
        staffService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
