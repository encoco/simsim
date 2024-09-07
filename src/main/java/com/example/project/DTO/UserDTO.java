package com.example.project.DTO;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    int id;
    String username;
    String nickname;
    String email;
    String profile_img;
    String password;

    @Builder.Default
    private String role = "USER";
}
