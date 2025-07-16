package com.pharma.clientapp.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;

import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;
import java.security.Key;
/*import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
*/
@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    private final long EXPIRATION = 1000 * 60 * 60 * 10; // 1 сутки (access token)
    private final long REFRESH_EXPIRATION = 1000L * 60 * 60 * 24 * 365 * 10; // 10 лет
    
    // Ленивая инициализация ключа
    private volatile Key signingKey;

    private Key getSigningKey() {
        if (signingKey == null) {
            synchronized (this) {
                if (signingKey == null) {
                    logger.info("Инициализация JWT ключа...");
                    String secret = getJwtSecret();
                    if (secret == null || secret.length() < 32) {
                        logger.error("JWT_SECRET не найден или слишком короткий. Длина: {}", secret != null ? secret.length() : 0);
                        throw new IllegalStateException("JWT_SECRET must be set and at least 32 characters long");
                    }
                    logger.info("JWT_SECRET найден, длина: {}", secret.length());
                    signingKey = io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes());
                    logger.info("JWT ключ успешно инициализирован");
                }
            }
        }
        return signingKey;
    }

    private String getJwtSecret() {
        logger.debug("Попытка чтения JWT секрета...");
        // Сначала пытаемся прочитать из Docker Secret (оставлено закомментированным для будущего)
        /*
        try {
            String secretFromFile = Files.readString(Paths.get("/run/secrets/jwt_secret")).trim();
            if (secretFromFile != null && !secretFromFile.isEmpty()) {
                logger.debug("JWT секрет найден в файле /run/secrets/jwt_secret");
                return secretFromFile;
            }
        } catch (IOException e) {
            logger.debug("Файл /run/secrets/jwt_secret не найден, используем переменную окружения");
        }
        */
        // Fallback на переменную окружения
        String envSecret = System.getenv("JWT_SECRET");
        if (envSecret != null) {
            logger.debug("JWT секрет найден в переменной окружения");
        } else {
            logger.warn("JWT_SECRET не найден ни в файле, ни в переменной окружения");
        }
        return envSecret;
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
        // Исправляем вычисление времени для избежания переполнения
        long currentTime = System.currentTimeMillis();
        long expirationTime = currentTime + REFRESH_EXPIRATION;
        
        logger.info("Генерация refresh token для пользователя: {}", contactUid);
        logger.info("Текущее время: {}, время истечения: {}", new Date(currentTime), new Date(expirationTime));
        logger.info("Срок действия refresh token: {} дней", REFRESH_EXPIRATION / (1000L * 60 * 60 * 24));
        
        String token = Jwts.builder()
                .setSubject(contactUid)
                .setIssuedAt(new Date(currentTime))
                .setExpiration(new Date(expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        if (!validateRefreshToken(token)) {
            logger.error("Refresh token невалиден, смотри ошибки выше");
            //return generateRefreshToken(contactUid);
        }
        return token;
    }

    // Валидация refresh token
    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = getClaims(token);
            boolean isDegubEnabled = logger.isDebugEnabled();
            System.out.println("DEBUG разрешен: " + isDegubEnabled);
    
            logger.debug("Refresh token валиден для пользователя: {}, истекает: {}", 
                        claims.getSubject(), claims.getExpiration());
            return true;
        } catch (Exception e) {
            logger.warn("Refresh token невалиден: {}", e.getMessage());
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
        JwtParser parser = Jwts.parserBuilder().setSigningKey(getSigningKey()).build();
        return parser.parseClaimsJws(token).getBody();
    }
}
