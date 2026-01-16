package com.pharma.clientapp.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
//import com.fasterxml.jackson.databind.deser.std.NumberDeserializers;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

@Configuration
public class NumberFormatConfig {

    /**
     * Кастомный десериализатор для чисел, поддерживающий как точку, так и запятую
     */
    public static class FlexibleNumberDeserializer extends JsonDeserializer<Double> {
        
        @Override
        public Double deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String value = p.getValueAsString();
            if (value == null || value.trim().isEmpty()) {
                return null;
            }

            String trimmedValue = value.trim();
            
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
                        throw new IllegalArgumentException("Cannot parse number: " + value + ". Supported formats: 123.45, 123,45", e2);
                    }
                }
            }
        }
    }

    /**
     * Создаем ObjectMapper с поддержкой обоих форматов чисел
     */
    @Bean
    @Primary
    public ObjectMapper flexibleObjectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.createXmlMapper(false).build();
        
        SimpleModule module = new SimpleModule("FlexibleNumberModule");
        module.addDeserializer(Double.class, new FlexibleNumberDeserializer());
        module.addDeserializer(double.class, new FlexibleNumberDeserializer());
        mapper.registerModule(module);
        
        return mapper;
    }
}
