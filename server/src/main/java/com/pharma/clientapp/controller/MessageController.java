package com.pharma.clientapp.controller;

import com.pharma.clientapp.entity.Message;
import com.pharma.clientapp.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<Message> getAllMessages() {
        return messageService.findAll();
    }

    @GetMapping("/{uid}")
    public ResponseEntity<Message> getMessageById(@PathVariable String uid) {
        return messageService.findById(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Message createMessage(@RequestBody Message message) {
        return messageService.save(message);
    }

    @DeleteMapping("/{uid}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String uid) {
        messageService.deleteById(uid);
        return ResponseEntity.noContent().build();
    }
}
