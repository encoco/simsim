package com.example.project.Controller;

import com.example.project.DTO.UserDTO;
import com.example.project.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/EmailCheck")
    public ResponseEntity<?> test(@RequestBody UserDTO user){
        if(userService.EmailCheck(user.getEmail())){
            System.out.println("중복");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("중복");
        }else{
            System.out.println("비중복");
            return ResponseEntity.ok("비중복");
        }
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody UserDTO user){
        System.out.println("hgihihi");
        if(userService.signUp(user)){
            return ResponseEntity.ok("완료");
        }else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("다시 시도해주세요");
    }
}
