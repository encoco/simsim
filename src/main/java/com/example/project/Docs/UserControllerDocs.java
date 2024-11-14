package com.example.project.Docs;

import com.example.project.DTO.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

@Tag(name = "Users", description = "회원 인증 및 관리 API")
public interface UserControllerDocs {

    @Operation(
            summary = "이메일 중복 확인",
            description = "회원가입 전 이메일 중복 여부를 확인하고 인증 메일을 발송합니다.",
            parameters = {
                    @Parameter(name = "id", description = "사용자 아이디", example = "1"),
                    @Parameter(name = "email", description = "사용자 이메일", example = "user@example.com")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "이메일 사용 가능 - 인증코드 반환",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "이메일 중복",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    ResponseEntity<?> EmailCheck(UserDTO user);

    @Operation(
            summary = "회원가입",
            description = "새로운 사용자를 등록합니다.",
            parameters = {
                    @Parameter(name = "username", description = "사용자 이름", example = "johndoe"),
                    @Parameter(name = "email", description = "사용자 이메일", example = "john.doe@example.com"),
                    @Parameter(name = "password", description = "비밀번호", example = "password123")
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "회원가입 성공",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "회원가입 실패",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    ResponseEntity<?> signUp(UserDTO user);

    @Operation(
            summary = "로그아웃",
            description = "사용자 로그아웃 처리 및 리프레시 토큰을 제거합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "로그아웃 성공",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    ResponseEntity<?> logout(HttpServletResponse response);

    @Operation(
            summary = "AccessToken 재발급",
            description = "리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "새로운 액세스 토큰 발급 성공",
                    content = @Content(schema = @Schema(implementation = String.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "유효하지 않은 리프레시 토큰",
                    content = @Content(schema = @Schema(implementation = String.class))
            )
    })
    ResponseEntity<?> refreshToken(HttpServletRequest request);
}