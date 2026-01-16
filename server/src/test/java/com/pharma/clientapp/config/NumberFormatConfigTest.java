package com.pharma.clientapp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharma.clientapp.entity.InvoiceT;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.*;

@SpringJUnitConfig
@SpringBootTest(classes = NumberFormatConfig.class)
public class NumberFormatConfigTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    public void testNumberWithDot() throws Exception {
        String json = "{\"price\": \"123.45\", \"qnt\": \"10.5\"}";
        
        // Регистрируем наш модуль
        mapper.registerModule(new com.fasterxml.jackson.databind.module.SimpleModule()
            .addDeserializer(Double.class, new NumberFormatConfig.FlexibleNumberDeserializer())
            .addDeserializer(double.class, new NumberFormatConfig.FlexibleNumberDeserializer()));
        
        InvoiceT invoice = mapper.readValue(json, InvoiceT.class);
        
        assertEquals(123.45, invoice.getPrice());
        assertEquals(10.5, invoice.getQnt());
    }

    @Test
    public void testNumberWithComma() throws Exception {
        String json = "{\"price\": \"123,45\", \"qnt\": \"10,5\"}";
        
        // Регистрируем наш модуль
        mapper.registerModule(new com.fasterxml.jackson.databind.module.SimpleModule()
            .addDeserializer(Double.class, new NumberFormatConfig.FlexibleNumberDeserializer())
            .addDeserializer(double.class, new NumberFormatConfig.FlexibleNumberDeserializer()));
        
        InvoiceT invoice = mapper.readValue(json, InvoiceT.class);
        
        assertEquals(123.45, invoice.getPrice());
        assertEquals(10.5, invoice.getQnt());
    }

    @Test
    public void testMixedNumberFormats() throws Exception {
        String json = "{\"price\": \"123.45\", \"qnt\": \"10,5\", \"nds\": \"20.00\"}";
        
        // Регистрируем наш модуль
        mapper.registerModule(new com.fasterxml.jackson.databind.module.SimpleModule()
            .addDeserializer(Double.class, new NumberFormatConfig.FlexibleNumberDeserializer())
            .addDeserializer(double.class, new NumberFormatConfig.FlexibleNumberDeserializer()));
        
        InvoiceT invoice = mapper.readValue(json, InvoiceT.class);
        
        assertEquals(123.45, invoice.getPrice());
        assertEquals(10.5, invoice.getQnt());
        assertEquals(20.00, invoice.getNds());
    }
}
