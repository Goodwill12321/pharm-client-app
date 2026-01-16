package com.pharma.clientapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(@NonNull FormatterRegistry registry) {
        // Регистрируем конвертер для Double из query параметров
        registry.addConverter(new StringToDoubleConverter());
    }

    public static class StringToDoubleConverter implements org.springframework.core.convert.converter.Converter<String, Double> {
        
        @Override
        public Double convert(@NonNull String source) {
            if (source == null || source.trim().isEmpty()) {
                return null;
            }

            String trimmedValue = source.trim();
            
            // Пробуем сначала прямой парсинг с заменой запятой на точку
            try {
                return Double.parseDouble(trimmedValue.replace(',', '.'));
            } catch (NumberFormatException e) {
                // Если не получилось, пробуем с NumberFormat
                try {
                    // Сначала пробуем формат с точкой (US)
                    NumberFormat formatUS = NumberFormat.getInstance(Locale.US);
                    return formatUS.parse(trimmedValue).doubleValue();
                } catch (ParseException e1) {
                    try {
                        // Затем пробуем формат с запятой (FRANCE/GERMANY)
                        NumberFormat formatFR = NumberFormat.getInstance(Locale.FRANCE);
                        return formatFR.parse(trimmedValue).doubleValue();
                    } catch (ParseException e2) {
                        throw new IllegalArgumentException("Cannot parse number: " + source + ". Supported formats: 123.45, 123,45", e2);
                    }
                }
            }
        }
    }
}
