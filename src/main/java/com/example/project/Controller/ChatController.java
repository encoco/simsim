package com.example.project.Controller;

import com.example.project.Docs.ChatControllerDocs;
import com.example.project.DTO.ChatDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController implements ChatControllerDocs {
    private final SimpMessagingTemplate messagingTemplate;
    private final Queue<String> waitingQueue = new ConcurrentLinkedQueue<>();
    private final Map<String, String> chatPairs = new ConcurrentHashMap<>();
    private final Map<String, String> chatRooms = new ConcurrentHashMap<>(); // 채팅방 ID 저장

    @Override
    @MessageMapping("/message")
    public void message(ChatDTO message) {
        String roomId = chatRooms.get(message.getSender());
        if (roomId != null) {
            // 채팅방 ID로 메시지 전송
            messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, message);
        }
    }

    @Override
    @PostMapping("/message")
    public ResponseEntity<String> sendMessage(@RequestBody ChatDTO message) {
        message(message);
        return ResponseEntity.ok("Message sent");
    }

    @Override
    @MessageMapping("/match")
    public void match(String userId) {
        System.out.println("매칭 시작: " + userId);
        if (waitingQueue.contains(userId)) {
            return;
        }

        String partner = waitingQueue.poll();
        if (partner == null) {
            waitingQueue.offer(userId);
            System.out.println("대기열에 추가: " + userId);
            messagingTemplate.convertAndSend("/sub/chat/match/" + userId, "매칭 대기 중");
        } else {
            // 채팅방 ID 생성
            String roomId = generateRoomId(userId, partner);

            // 채팅방 ID 저장
            chatRooms.put(userId, roomId);
            chatRooms.put(partner, roomId);

            // 사용자 페어 저장
            chatPairs.put(userId, partner);
            chatPairs.put(partner, userId);

            System.out.println("매칭 성공 - Room: " + roomId + ", Users: " + userId + ", " + partner);

            // 매칭 결과 전송 (채팅방 ID 포함)
            Map<String, String> response1 = new HashMap<>();
            response1.put("message", partner + "님과 매칭되었습니다");
            response1.put("roomId", roomId);

            Map<String, String> response2 = new HashMap<>();
            response2.put("message", userId + "님과 매칭되었습니다");
            response2.put("roomId", roomId);

            messagingTemplate.convertAndSend("/sub/chat/match/" + userId, response1);
            messagingTemplate.convertAndSend("/sub/chat/match/" + partner, response2);
        }
    }

    @Override
    @PostMapping("/match")
    public ResponseEntity<String> startMatch(@RequestParam String userId) {
        match(userId);
        return ResponseEntity.ok("Matching started");
    }

    @Override
    @MessageMapping("/leave")
    public void leave(String userId) {
        String partner = chatPairs.remove(userId);
        String roomId = chatRooms.remove(userId);

        if (partner != null) {
            chatPairs.remove(partner);
            chatRooms.remove(partner);
            System.out.println("사용자 퇴장 - User: " + userId + ", Partner: " + partner + ", Room: " + roomId);
            messagingTemplate.convertAndSend("/sub/chat/match/" + partner, "상대방이 채팅방을 나갔습니다");
        }
        waitingQueue.remove(userId);
    }

    @Override
    @PostMapping("/leave")
    public ResponseEntity<String> leaveChat(@RequestParam String userId) {
        leave(userId);
        return ResponseEntity.ok("Left chat room");
    }

    @Override
    @GetMapping("/status")
    public ResponseEntity<Map<String, Integer>> getChatStatus() {
        Map<String, Integer> status = new HashMap<>();
        status.put("waitingUsers", waitingQueue.size());
        status.put("activeChats", chatPairs.size() / 2);
        return ResponseEntity.ok(status);
    }

    private String generateRoomId(String user1, String user2) {
        String[] users = {user1, user2};
        Arrays.sort(users); // 정렬하여 일관된 roomId 생성
        return "room-" + users[0] + "-" + users[1];
    }
}