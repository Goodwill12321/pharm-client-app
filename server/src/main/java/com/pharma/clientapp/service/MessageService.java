package com.pharma.clientapp.service;

import com.pharma.clientapp.entity.Message;
import com.pharma.clientapp.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Optional<Message> findById(String uid) {
        return messageRepository.findById(uid);
    }

    public Message save(Message message) {
        return messageRepository.save(message);
    }

    public void deleteById(String uid) {
        messageRepository.deleteById(uid);
    }
}
