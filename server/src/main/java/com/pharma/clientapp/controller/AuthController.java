package com.pharma.clientapp.controller;

import com.pharma.clientapp.dto.LoginRequest;
import com.pharma.clientapp.dto.JwtResponse;
import com.pharma.clientapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // Предполагаем, что authenticate теперь возвращает объект с access и refresh
        var tokens = authService.authenticateWithRefresh(loginRequest.getLogin(), loginRequest.getPassword());
        // refresh token кладём в HttpOnly cookie
        Cookie refreshCookie = new Cookie("refreshToken", tokens.getRefreshToken());
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(60 * 60 * 24 * 365 * 10); // 10 лет
        response.addCookie(refreshCookie);
        return ResponseEntity.ok(new JwtResponse(tokens.getAccessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }
        String newAccessToken = authService.refreshAccessToken(refreshToken);
        if (newAccessToken == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new JwtResponse(newAccessToken));
    }
}
