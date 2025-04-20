package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, String> {
}
