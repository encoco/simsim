package com.example.project.Controller;

import com.example.project.DTO.ChatDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

// 채팅 관련 요청을 처리하는 컨트롤러
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    // 매칭 대기 중인 사용자 큐
    private final Queue<String> waitingQueue = new ConcurrentLinkedQueue<>();
    // 현재 채팅 중인 사용자 쌍
    private final Map<String, String> chatPairs = new ConcurrentHashMap<>();

    // 채팅 메시지 처리
    @MessageMapping("/chat/message")
    public void message(ChatDTO message) {
        String receiver = chatPairs.get(message.getSender());
        if (receiver != null) {
            messagingTemplate.convertAndSend("/sub/chat/room/" + receiver, message);
        }
    }

    // 랜덤 매칭 처리
    @MessageMapping("/chat/match")
    public void match(String userId) {
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

    // 채팅방 나가기 처리
    @MessageMapping("/chat/leave")
    public void leave(String userId) {
        String partner = chatPairs.remove(userId);
        if (partner != null) {
            chatPairs.remove(partner);
            messagingTemplate.convertAndSend("/sub/chat/match/" + partner, "상대방이 채팅방을 나갔습니다");
        }
        waitingQueue.remove(userId);
    }
}
