package com.example.project.Config.JWT;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String requestURI = httpRequest.getRequestURI();
        String refreshToken = null;
        String accessToken = getTokenFromRequest(httpRequest);

        System.out.println("URI : " + requestURI);
        //기본 로그인,회원가입,이메일인증,로그아웃(/api/auth), 통신은 허용
        if (requestURI.startsWith("/api/ws") || requestURI.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        //쿠키중에 refreshToken 찾아서 저장
        if (httpRequest.getCookies() != null) {
            for (Cookie cookie : httpRequest.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        } else System.out.println("cookies is null sibal");

        //refresh(access 만료, ref 유효 시 실행되는 요청)
        if (requestURI.startsWith("/api/refresh")) {
            if (refreshToken != null) {
                httpRequest.setAttribute("refreshToken", refreshToken);
                filterChain.doFilter(httpRequest, response);
            } else {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token expired\"}");
            }
            return;
        }

        //access토큰 유효 시 원래 요청 실행
        if (accessToken != null && !jwtUtil.isExpired(accessToken)) {
            filterChain.doFilter(request, response);
        } else {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token expired\"}");
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7, authorizationHeader.length()); // "Bearer " 이후의 문자열을
            // 토큰으로 추출
            return token;
        }
        return null;
    }

}