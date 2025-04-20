package com.pharma.clientapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pharma.clientapp.entity.Client;
import com.pharma.clientapp.service.ClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClientController.class)
public class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClientService clientService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateClient() throws Exception {
        Client client = new Client();
        client.setUid("uid-123");
        client.setName("Test User");
        client.setCode("CODE123");

        when(clientService.save(any(Client.class))).thenReturn(client);

        mockMvc.perform(post("/api/clients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(client)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.uid").value("uid-123"))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.code").value("CODE123"));

        verify(clientService).save(any(Client.class));
    }

    @Test
    void testGetClientByIdFound() throws Exception {
        Client client = new Client();
        client.setUid("uid-123");
        client.setName("Test User");
        client.setCode("CODE123");

        when(clientService.findById("uid-123")).thenReturn(Optional.of(client));

        mockMvc.perform(get("/api/clients/uid-123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.uid").value("uid-123"))
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.code").value("CODE123"));
    }

    @Test
    void testGetClientByIdNotFound() throws Exception {
        when(clientService.findById("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/clients/unknown"))
            .andExpect(status().isNotFound());
    }
}
