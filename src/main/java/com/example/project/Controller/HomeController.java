package com.example.project.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/hello")
    public ResponseEntity<?> test(){
        System.out.println("안녕");
        return ResponseEntity.ok("안녕");
    }
}
