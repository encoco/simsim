package com.example.project.Entity;


import io.swagger.v3.oas.annotations.media.Schema;
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

    @Schema(description = "발신자 ID", example = "zㅣ존철수")
    private String sender;
    
    @Schema(description = "메시지 내용", example = "반갑다 애송이.")
    private String content;

    @Schema(description = "전송 시간", example = "2024-11-11")
    private String timestamp;
}
