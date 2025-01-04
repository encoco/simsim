package com.example.project.Service;

import com.example.project.DTO.PUBG.PlayerStats;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
//PubgStatsService
@Service
public class PubgStatsService {

    @Value("${pubg.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.pubg.com";
    private final RestTemplate restTemplate = new RestTemplate();

    public PlayerStats getPlayerStats(String nickname, String platform) {
        // 1. 먼저 플레이어 ID를 조회
        String playerId = getPlayerId(nickname, platform);

        // 2. 현재 시즌 ID 조회
        String currentSeasonId = getCurrentSeason(platform);

        // 3. 시즌 통계 조회
        return getSeasonStats(playerId, currentSeasonId, platform);
    }

    private String getPlayerId(String nickname, String platform) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/shards/{platform}/players")
                .queryParam("filter[playerNames]", nickname)
                .buildAndExpand(platform)
                .toUriString();

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map data = (Map) ((java.util.List) response.getBody().get("data")).get(0);
        return (String) data.get("id");
    }

    private String getCurrentSeason(String platform) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/shards/{platform}/seasons")
                .buildAndExpand(platform)
                .toUriString();

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        // 현재 시즌 찾기 (가장 최근 시즌)
        java.util.List<Map> seasons = (java.util.List<Map>) response.getBody().get("data");
        Optional<Map> currentSeason = seasons.stream()
                .filter(season -> {
                    Map attributes = (Map) season.get("attributes");
                    return Boolean.TRUE.equals(attributes.get("isCurrentSeason"));
                })
                .findFirst();

        return currentSeason.map(season -> (String) season.get("id"))
                .orElseThrow(() -> new RuntimeException("Current season not found"));
    }



    private PlayerStats getSeasonStats(String playerId, String seasonId, String platform) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/shards/{platform}/players/{playerId}/seasons/{seasonId}/ranked")  // 엔드포인트 변경
                .buildAndExpand(platform, playerId, seasonId)
                .toUriString();

        HttpEntity<String> entity = new HttpEntity<>(getHeaders());

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map statsData = (Map) ((Map) response.getBody().get("data")).get("attributes");
        Map gameModeStats = (Map) statsData.get("rankedGameModeStats");  // rankedGameModeStats로 변경
        Map squadStats = (Map) gameModeStats.get("squad");  // 다시 squad로 변경

        double kda = getDoubleValue(squadStats, "kda");
        double damageDealt = getDoubleValue(squadStats, "damageDealt");
        int roundsPlayed = getIntValue(squadStats, "roundsPlayed");
        double headshotKillRatio = getDoubleValue(squadStats, "headshotKillRatio");

        // 평균 딜량 계산
        double averageDamage = roundsPlayed > 0 ? damageDealt / roundsPlayed : 0;

        return PlayerStats.builder()
                .kda(Math.round(kda * 100) / 100.0)           // 소수점 2자리까지 반올림
                .averageDamage(Math.ceil(averageDamage))      // 딜량은 올림
                .headshotRatio(Math.round(headshotKillRatio * 100) / 100.0)  // 소수점 2자리까지 반올림
                .build();
    }

    // 헬퍼 메서드들
    private int getIntValue(Map stats, String key) {
        Number value = (Number) stats.get(key);
        return value != null ? value.intValue() : 0;
    }

    private double getDoubleValue(Map stats, String key) {
        Number value = (Number) stats.get(key);
        return value != null ? value.doubleValue() : 0.0;
    }




    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Accept", "application/vnd.api+json");
        return headers;
    }
}