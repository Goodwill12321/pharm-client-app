package com.pharma.clientapp.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private Environment env;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //boolean isDev = false;
        final boolean isDev = java.util.Arrays.stream(env.getActiveProfiles())
            .anyMatch(profile -> profile.startsWith("dev"));
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> {
                auth
                    .requestMatchers(
                        "/auth/login",
                        "/auth/refresh",
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/webjars/**",
                        "/actuator/health",
                        "/actuator/info"
                    ).permitAll();
                if (isDev) {
                    auth.requestMatchers("/api/hot-reload-info/history", "/profile").permitAll();
                }
                auth.anyRequest().authenticated();
            })
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
