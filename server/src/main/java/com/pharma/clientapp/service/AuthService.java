package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.repository.ContactRepository;
import com.pharma.clientapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
// Для работы этого класса убедитесь, что зависимость spring-boot-starter-security добавлена в pom.xml
import org.springframework.stereotype.Service;
import com.pharma.clientapp.dto.AuthTokens;

@Service
public class AuthService {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private JwtUtil jwtUtil;

    public String authenticate(String login, String password) {
        Contact contact = contactRepository.findAll().stream()
                .filter(c -> login.equals(c.getLogin()))
                .findFirst().orElse(null);
        if (contact == null) throw new RuntimeException("Пользователь не найден");
        if (!BCrypt.checkpw(password, contact.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }
        return jwtUtil.generateToken(contact.getUid());
    }

    // Новый метод для логина с refresh token
    public AuthTokens authenticateWithRefresh(String login, String password) {
        Contact contact = contactRepository.findAll().stream()
                .filter(c -> login.equals(c.getLogin()))
                .findFirst().orElse(null);
        if (contact == null) throw new RuntimeException("Пользователь не найден");
        if (!BCrypt.checkpw(password, contact.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }
        String accessToken = jwtUtil.generateToken(contact.getUid());
        String refreshToken = jwtUtil.generateRefreshToken(contact.getUid());
        return new AuthTokens(accessToken, refreshToken);
    }

    // Обновление access token по refresh token
    public String refreshAccessToken(String refreshToken) {
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            return null;
        }
        String contactUid = jwtUtil.extractContactUid(refreshToken);
        return jwtUtil.generateToken(contactUid);
    }
}

