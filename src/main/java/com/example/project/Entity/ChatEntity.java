package com.example.project.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name="chat")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatEntity {
    @Id
    private int id;
    private String sender;
    private String content;
    private String timestamp;
}
