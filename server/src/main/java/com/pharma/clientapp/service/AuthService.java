package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Contact;
import com.pharma.clientapp.repository.ContactRepository;
import com.pharma.clientapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
// Для работы этого класса убедитесь, что зависимость spring-boot-starter-security добавлена в pom.xml
import org.springframework.stereotype.Service;

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
        //System.out.println(contact);
        if (!BCrypt.checkpw(password, contact.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }
        return jwtUtil.generateToken(contact.getUid());
    }
}
