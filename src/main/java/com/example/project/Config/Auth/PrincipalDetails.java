package com.example.project.Config.Auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.project.DTO.UserDTO;

//시큐리티 로그인 시 오브젝트 = Authentication 타입 객체 안에 User 정보가 있어야 함.
// User 오브젝트 타입 -> UserDetails 타입 객체
// security Session => Authentication => UserDetails(PrincipalDetails

@AllArgsConstructor
@ToString
public class PrincipalDetails implements UserDetails, OAuth2User{
    private final UserDTO user;

    @Override   //권한 return
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return user.getRole();
            }
        });
        return collect;
    }

    public UserDTO getUserDTO() {
        return user;
    }
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // TODO Auto-generated method stub
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Map<String, Object> getAttributes() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getName() {
        return null;
    }
}