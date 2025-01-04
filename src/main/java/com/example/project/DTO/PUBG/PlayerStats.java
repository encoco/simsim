package com.example.project.DTO.PUBG;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayerStats {
    private double kda;          // K/D 비율
    private double averageDamage;  // 평균 딜량
    private double headshotRatio;  // 헤드샷 비율 (%)
}