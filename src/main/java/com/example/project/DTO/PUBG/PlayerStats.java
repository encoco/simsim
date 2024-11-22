package com.example.project.DTO;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PlayerStats {
    private String accountId;
    private String nickname;
    private double kda;
    private double damageDealt;
}