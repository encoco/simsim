package com.example.project.Controller;

import com.example.project.Config.JWT.JwtUtil;
import com.example.project.Docs.UserControllerDocs;
import com.example.project.DTO.UserDTO;
import com.example.project.Service.MailService;
import com.example.project.Service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {
    private final UserService userService;
    private final MailService mailService;
    private final JwtUtil jwtUtil;

    @PostMapping("/auth/EmailCheck")
    public ResponseEntity<?> EmailCheck(@RequestBody UserDTO user) {
        if(userService.EmailCheck(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("중복");
        }
        String verification = mailService.sendVerificationEmail(user.getEmail());
        return ResponseEntity.ok(verification);
    }

    @PostMapping("/auth/signUp")
    public ResponseEntity<?> signUp(@RequestBody UserDTO user) {
        if(userService.signUp(user)) {
            return ResponseEntity.ok("완료");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("다시 시도해주세요");
    }

    @GetMapping("/auth/Logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setMaxAge(0);
        refreshTokenCookie.setPath("/");
        return new ResponseEntity<>("You've been logged out successfully.", HttpStatus.OK);
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = (String) request.getAttribute("refreshToken");
        if (refreshToken != null && !jwtUtil.isExpired(refreshToken)) {
            String newAccessToken = jwtUtil.newAccessToken(refreshToken);
            return ResponseEntity.ok().body(newAccessToken);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
    }
}