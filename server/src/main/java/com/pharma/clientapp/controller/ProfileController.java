package com.pharma.clientapp.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {
    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/profile")
    public String getProfile() {
        return activeProfile;
    }
} 