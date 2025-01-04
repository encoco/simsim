package com.example.project.Controller;

import com.example.project.DTO.PUBG.PlayerStats;
import com.example.project.Service.PubgStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PlayerStatsController {

    private final PubgStatsService pubgStatsService;

    @GetMapping("/BGNick")
    public ResponseEntity<?> getStats(@RequestParam String nickname, @RequestParam String platform) {
        try {
            System.out.println("?");
            PlayerStats stats = pubgStatsService.getPlayerStats(nickname, platform);
            System.out.println(stats);
            return new ResponseEntity<>(stats, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch PUBG stats: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
