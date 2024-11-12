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
        String requestURI = ((HttpServletRequest) request).getRequestURI();
        String refreshToken = null;
        String accessToken = getTokenFromRequest((HttpServletRequest) request);

        System.out.println("URI : " + requestURI);
        //기본 로그인,회원가입,이메일인증,로그아웃(/api/auth), 통신, Swagger 허용
        if (requestURI.startsWith("/api/ws") ||
                requestURI.startsWith("/api/auth/") ||
                requestURI.startsWith("/swagger-ui") ||
                requestURI.startsWith("/v3/api-docs") ||
                requestURI.startsWith("/api-docs") ||
                requestURI.equals("/swagger-ui.html")) {
            filterChain.doFilter(request, response);
            return;
        }

        //쿠키중에 refreshToken 찾아서 저장
        if (((HttpServletRequest) request).getCookies() != null) {
            for (Cookie cookie : ((HttpServletRequest) request).getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        } else System.out.println("cookies is null sibal");

        //refresh(access 만료, ref 유효 시 실행되는 요청)
        if (requestURI.startsWith("/api/refresh")) {
            if (refreshToken != null) {
                ((HttpServletRequest) request).setAttribute("refreshToken", refreshToken);
                filterChain.doFilter((HttpServletRequest) request, response);
            } else {
                ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ((HttpServletResponse) response).setContentType("application/json");
                ((HttpServletResponse) response).getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token expired\"}");
            }
            return;
        }

        //access토큰 유효 시 원래 요청 실행
        if (accessToken != null && !jwtUtil.isExpired(accessToken)) {
            filterChain.doFilter(request, response);
        } else {
            ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ((HttpServletResponse) response).setContentType("application/json");
            ((HttpServletResponse) response).getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Token expired\"}");
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // 토큰으로 추출
            return authorizationHeader.substring(7);
        }
        return null;
    }

}