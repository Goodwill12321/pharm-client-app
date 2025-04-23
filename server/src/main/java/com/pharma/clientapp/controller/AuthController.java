package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.LoginRequest;
import com.pharma.clientapp.dto.JwtResponse;
import com.pharma.clientapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        String token = authService.authenticate(loginRequest.getLogin(), loginRequest.getPassword());
        return ResponseEntity.ok(new JwtResponse(token));
    }
}
