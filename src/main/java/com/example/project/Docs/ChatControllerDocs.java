package com.example.project.Docs;

import com.example.project.DTO.ChatDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "Chat", description = "채팅 관련 API")
public interface ChatControllerDocs {

    @Operation(summary = "메시지 전송 (WebSocket)", description = "WebSocket을 통한 메시지 전송")
    void message(@Parameter(description = "채팅 메시지 정보") ChatDTO message);

    @Operation(summary = "채팅 메시지 전송", description = "채팅 메시지 전송")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<String> sendMessage(
            @Parameter(description = "채팅 메시지 정보") ChatDTO message
    );

    @Operation(summary = "매칭 시작", description = "매칭 시작")
    void match(@Parameter(description = "매칭을 시작하는 사용자 ID", example = "user123") String userId);

    @Operation(summary = "랜덤 채팅 매칭 시작 (HTTP)", description = "HTTP를 통한 랜덤 채팅 매칭 시작")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "매칭 시작 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<String> startMatch(
            @Parameter(description = "사용자 ID", example = "user123", required = true) String userId
    );

    @Operation(summary = "채팅방 나가기 (WebSocket)", description = "WebSocket을 통한 채팅방 나가기")
    void leave(
            @Parameter(description = "채팅방을 나가는 사용자 ID", example = "user123") String userId
    );

    @Operation(summary = "채팅방 나가기 (HTTP)", description = "HTTP를 통한 채팅방 나가기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅방 나가기 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<String> leaveChat(
            @Parameter(description = "채팅방을 나가려는 사용자 ID", example = "user123", required = true) String userId
    );

    @Operation(summary = "채팅 상태 조회", description = "현재 매칭 대기 및 채팅 중인 사용자 수 조회")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상태 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    ResponseEntity<Map<String, Integer>> getChatStatus();
}