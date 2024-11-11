package com.example.project.Controller;

import com.example.project.Config.JWT.JwtUtil;
import com.example.project.DTO.UserDTO;
import com.example.project.Service.MailService;
import com.example.project.Service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final MailService mailService;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expirationTime.refresh}")
    private long refreshExpirationTime;

    @PostMapping("/auth/EmailCheck")
    public ResponseEntity<?> test(@RequestBody UserDTO user){
        if(userService.EmailCheck(user.getEmail())){
            System.out.println("중복");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("중복");
        }else{
            String verification = mailService.sendVerificationEmail(user.getEmail());
            System.out.println(verification);
            return ResponseEntity.ok(verification);
        }
    }

    @PostMapping("/auth/signUp")
    public ResponseEntity<?> signUp(@RequestBody UserDTO user){
        if(userService.signUp(user)){
            return ResponseEntity.ok("완료");
        }else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("다시 시도해주세요");
    }


    @GetMapping("/auth/Logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        System.out.println("Logout");
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setMaxAge(0);
        refreshTokenCookie.setPath("/");

        return new ResponseEntity<>("You've been logged out successfully.", HttpStatus.OK);
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        // 리프레시 토큰 검증 로직
        String refreshToken = (String) request.getAttribute("refreshToken");
        if (refreshToken != null && !jwtUtil.isExpired(refreshToken)) {
            String newAccessToken = jwtUtil.newAccessToken(refreshToken);
            return ResponseEntity.ok().body(newAccessToken);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
        }
    }


}
