package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.ClientManager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientManagerRepository extends JpaRepository<ClientManager, Long> {
    void deleteAllByClientUid(String clientUid);

}
