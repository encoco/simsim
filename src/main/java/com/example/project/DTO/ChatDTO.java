package com.example.project.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ChatDTO {
    private int id;
    private String sender;
    private String content;
    private String timestamp;
}
