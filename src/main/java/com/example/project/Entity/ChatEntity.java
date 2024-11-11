package com.example.project.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ChatEntity {
    @Id
    private int id;
    private String sender;
    private String content;
    private String timestamp;
}
