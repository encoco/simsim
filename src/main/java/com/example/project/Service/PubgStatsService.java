package com.example.project.Service;

import com.example.project.DTO.PUBG.PlayerStats;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.Optional;
//PubgStatsService
@Service
public class PlayerStatService {

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
                .filter(season -> (Boolean) season.get("attributes.isCurrentSeason"))
                .findFirst();

        return (String) currentSeason.get().get("id");
    }

    private PlayerStats getSeasonStats(String playerId, String seasonId, String platform) {
        String url = UriComponentsBuilder
                .fromHttpUrl(BASE_URL)
                .path("/shards/{platform}/players/{playerId}/seasons/{seasonId}")
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
        Map gameModeStats = (Map) statsData.get("gameModeStats");

        // squad-fpp 모드의 스탯을 예시로 가져옴 (다른 모드도 필요하다면 추가 가능)
        Map squadFppStats = (Map) gameModeStats.get("squad-fpp");

        return PlayerStats.builder()
                .kills((Integer) squadFppStats.get("kills"))
                .deaths((Integer) squadFppStats.get("losses"))  // deaths는 losses로 표시됨
                .damageDealt((Double) squadFppStats.get("damageDealt"))
                .build();
    }

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Accept", "application/vnd.api+json");
        return headers;
    }
}