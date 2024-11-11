package com.example.project.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name="users")
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {
    @Id
    int id;
    String username;
    String nickname;
    String profile_img;
    String email;
    String password;
    @Builder.Default
    private String role = "USER";
}
