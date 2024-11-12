package com.example.project.Controller;

import com.example.project.DTO.ChatDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "채팅 관련 API")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final Queue<String> waitingQueue = new ConcurrentLinkedQueue<>();
    private final Map<String, String> chatPairs = new ConcurrentHashMap<>();

    @MessageMapping("/chat/message")
    @Operation(summary = "메시지 전송 (WebSocket)", description = "WebSocket을 통한 메시지 전송")
    public void message(@Parameter(description = "채팅 메시지 정보") ChatDTO message) {
        String receiver = chatPairs.get(message.getSender());
        if (receiver != null) {
            messagingTemplate.convertAndSend("/sub/chat/room/" + receiver, message);
        }
    }

    @PostMapping("/message")
    @Operation(summary = "채팅 메시지 전송", description = "채팅 메시지 전송")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<String> sendMessage(
            @RequestBody
            @Parameter(description = "채팅 메시지 정보")
            ChatDTO message
    ) {
        message(message);
        return ResponseEntity.ok("Message sent");
    }

    @MessageMapping("/chat/match")
    @Operation(summary = "매칭 시작", description = "매칭 시작")
    public void match(@Parameter(description = "매칭을 시작하는 사용자 ID", example = "user123") String userId) {
        if (waitingQueue.contains(userId)) {
            return;
        }

        String partner = waitingQueue.poll();
        if (partner == null) {
            waitingQueue.offer(userId);
            messagingTemplate.convertAndSend("/sub/chat/match/" + userId, "매칭 대기 중");
        } else {
            chatPairs.put(userId, partner);
            chatPairs.put(partner, userId);
            messagingTemplate.convertAndSend("/sub/chat/match/" + userId, partner + "님과 매칭되었습니다");
            messagingTemplate.convertAndSend("/sub/chat/match/" + partner, userId + "님과 매칭되었습니다");
        }
    }

    @PostMapping("/match")
    @Operation(summary = "랜덤 채팅 매칭 시작 (HTTP)", description = "HTTP를 통한 랜덤 채팅 매칭 시작")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "매칭 시작 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")})
    public ResponseEntity<String> startMatch(
            @Parameter(description = "사용자 ID", example = "user123", required = true)
            @RequestParam String userId) {
        match(userId);
        return ResponseEntity.ok("Matching started");
    }

    @MessageMapping("/chat/leave")
    @Operation(summary = "채팅방 나가기 (WebSocket)", description = "WebSocket을 통한 채팅방 나가기")
    public void leave(
            @Parameter(description = "채팅방을 나가는 사용자 ID", example = "user123")
            String userId) {
        String partner = chatPairs.remove(userId);
        if (partner != null) {
            chatPairs.remove(partner);
            messagingTemplate.convertAndSend("/sub/chat/match/" + partner, "상대방이 채팅방을 나갔습니다");
        }
        waitingQueue.remove(userId);
    }

    @PostMapping("/leave")
    @Operation(summary = "채팅방 나가기 (HTTP)", description = "HTTP를 통한 채팅방 나가기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅방 나가기 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<String> leaveChat(
            @Parameter(description = "채팅방을 나가려는 사용자 ID", example = "user123", required = true)
            @RequestParam String userId) {
        leave(userId);
        return ResponseEntity.ok("Left chat room");
    }

    @GetMapping("/status")
    @Operation(summary = "채팅 상태 조회", description = "현재 매칭 대기 및 채팅 중인 사용자 수 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상태 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<Map<String, Integer>> getChatStatus() {
        Map<String, Integer> status = new HashMap<>();
        status.put("waitingUsers", waitingQueue.size());
        status.put("activeChats", chatPairs.size() / 2);
        return ResponseEntity.ok(status);
    }
}