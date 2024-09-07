package com.example.project.Config.JWT;

import com.example.project.Config.Auth.PrincipalDetails;
import com.example.project.DTO.UserDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expirationTime.access}")
    private long accessExpirationTime;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * JWT 토큰 생성 메서드
     * @param userDetails 유저의 정보를 넘겨주기 위한 userDetails(FORM, OAuth 로그인 통합)
     * @param expirationTime 유효시간 설정 (Access, Refresh Token 구분)
     * @return 사용자의 id가 담긴 토큰 Return
     */
    public String generateToken(PrincipalDetails userDetails, long expirationTime) {
        // 인증 정보에서 사용자 이름 추출
        UserDTO userDTO = userDetails.getUserDTO();
        int id = userDTO.getId();
        return Jwts.builder()
                .subject(String.valueOf(id))
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + expirationTime))
                .signWith(this.getSigningKey())
                .compact();
    }

    /**
     *
     * @param token
     * @return 만료 됨 True 유효함 False
     */
    public Boolean isExpired(String token) {
        try {
            Date expirationDate = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();

            return expirationDate.before(new Date());
        } catch (ExpiredJwtException e) {
            System.out.println("만료");
            return true;
        } catch (Exception e) {
            System.out.println("Token validation error: " + e.getMessage());
            return true; // 또는 상황에 따라 false를 반환할 수 있습니다.
        }
    }

    /**
     * 기존 Token으로 새 Token 생성
     * @param refreshToken
     * @return newAccessToken
     */
    public String newAccessToken(String refreshToken) {
        try {
            // 리프레시 토큰 검증
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(this.getSigningKey())
                    .build()
                    .parseSignedClaims(refreshToken);

            // 검증된 claims에서 subject(사용자 ID) 추출
            String userId = claims.getPayload().getSubject();

            // 새로운 액세스 토큰 생성
            return Jwts.builder()
                    .subject(userId)
                    .issuedAt(new Date())
                    .expiration(new Date((new Date()).getTime() + accessExpirationTime))
                    .signWith(this.getSigningKey())
                    .compact();
        } catch (JwtException e) {
            return null;
        }
    }
}