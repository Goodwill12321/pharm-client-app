package com.pharma.clientapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.security.Key;

@Component
public class JwtUtil {
    private final long EXPIRATION = 1000 * 60 * 60 * 10; // 10 часов (access token)
    private final long REFRESH_EXPIRATION = 1000L * 60 * 60 * 24 * 365 * 10; // 10 лет

    private Key getSigningKey() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT_SECRET env variable must be set and at least 32 characters long");
        }
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String contactUid) {
        return Jwts.builder()
                .setSubject(contactUid)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Генерация refresh token (10 лет)
    public String generateRefreshToken(String contactUid) {
        return Jwts.builder()
                .setSubject(contactUid)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Валидация refresh token
    public boolean validateRefreshToken(String token) {
        try {
            getClaims(token); // Проверяет подпись и срок действия
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractContactUid(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }
}
