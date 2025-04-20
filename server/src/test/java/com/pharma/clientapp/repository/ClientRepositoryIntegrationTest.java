package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Client;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
public class ClientRepositoryIntegrationTest {

    @SuppressWarnings("resource")
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("clientapp")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private ClientRepository clientRepository;

    @Test
    void testSaveAndFindClient() {
        Client client = new Client();
        client.setUid(UUID.randomUUID().toString());
        client.setName("IntegrationTest Client");
        client.setCode("ITC123");
        Client saved = clientRepository.save(client);

        Optional<Client> found = clientRepository.findById(saved.getUid());
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("IntegrationTest Client");
        assertThat(found.get().getCode()).isEqualTo("ITC123");
    }
}
