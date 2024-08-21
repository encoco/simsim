package com.example.project.Config;

import com.example.project.Config.Auth.PrincipalDetails;
import com.example.project.DTO.UserDTO;
import io.jsonwebtoken.Jwts;
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

}
