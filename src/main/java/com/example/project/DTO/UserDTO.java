package com.example.project.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 정보 DTO")
public class UserDTO {
    @Schema(
            description = "사용자 ID",
            example = "1"
    )
    private int id;

    @Schema(
            description = "사용자 이름",
            example = "johndoe"
    )
    private String username;

    @Schema(
            description = "사용자 닉네임",
            example = "John Doe"
    )
    private String nickname;

    @Schema(
            description = "사용자 이메일",
            example = "john.doe@example.com"
    )
    private String email;

    @Schema(
            description = "프로필 이미지 URL",
            example = "https://example.com/profile/image.jpg"
    )
    private String profile_img;

    @Schema(
            description = "사용자 비밀번호",
            example = "password123",
            accessMode = Schema.AccessMode.WRITE_ONLY // 응답에서는 비밀번호 필드를 제외
    )
    private String password;

    @Schema(
            description = "사용자 권한",
            example = "USER",
            defaultValue = "USER",
            allowableValues = {"USER", "ADMIN"}
    )
    @Builder.Default
    private String role = "USER";
}