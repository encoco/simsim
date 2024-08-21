package com.example.project.Config.Auth;

import com.example.project.Config.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    @Value("${jwt.expirationTime.access}")
    private long accessExpirationTime;
    @Value("${jwt.expirationTime.refresh}")
    private long refreshExpirationTime;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        PrincipalDetails userDetails = (PrincipalDetails) principal;

        String accessToken = jwtUtil.generateToken(userDetails, accessExpirationTime); // Access Token 생성
        String refreshToken = jwtUtil.generateToken(userDetails, refreshExpirationTime); // Refresh Token 생성
        System.out.println("access : " + accessToken);
        System.out.println("refresh : " + refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken).httpOnly(true).path("/").build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(accessToken); // 클라이언트로 응답 전송
    }
}