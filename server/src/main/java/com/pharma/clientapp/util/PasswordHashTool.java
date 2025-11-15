package com.pharma.clientapp.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTool {

    
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java ... PasswordHashTool <password>");
            System.exit(1);
        }

        String rawPassword = args[0];

        // Можно указать cost=12, чтобы новые хэши были того же «уровня сложности»
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

        String encoded = encoder.encode(rawPassword);
        //System.out.println("Raw password : " + rawPassword);
        System.out.println("BCrypt hash  : " + encoded);

        
    }
}