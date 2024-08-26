package com.example.project.Controller;

import com.example.project.DTO.UserDTO;
import com.example.project.Service.MailService;
import com.example.project.Service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final MailService mailService;

    @PostMapping("/EmailCheck")
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

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody UserDTO user){
        if(userService.signUp(user)){
            return ResponseEntity.ok("완료");
        }else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("다시 시도해주세요");
    }

    @GetMapping("/Logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie refreshTokenCookie = new Cookie("refreshToken", null); // 쿠키 이름을 refreshToken으로 변경
        refreshTokenCookie.setMaxAge(0); // 쿠키의 만료 시간을 0으로 설정하여 즉시 만료
        refreshTokenCookie.setPath("/"); // 모든 경로에서 유효한 쿠키로 설정
        response.addCookie(refreshTokenCookie); // 쿠키를 응답에 추가하여 클라이언트에 전송, 삭제됨을 알림

        return new ResponseEntity<>("You've been logged out successfully.", HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(){
        System.out.println("test");
        return ResponseEntity.ok("hi");
    }
}
