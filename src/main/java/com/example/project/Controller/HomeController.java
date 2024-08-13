package com.example.project.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/EmailCheck")
    public ResponseEntity<?> test(){

        return ResponseEntity.ok("안녕");
    }
}
