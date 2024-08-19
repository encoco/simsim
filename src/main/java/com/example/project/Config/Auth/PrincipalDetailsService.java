package com.example.project.Config.Auth;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.project.DTO.UserDTO;
import com.example.project.Repository.UserRepository;
import com.example.project.Entity.UserEntity;
import lombok.RequiredArgsConstructor;

// loginProcessingUrl 의 url 에 요청이 오면 자동으로 UserDetailsService 타입으로 IOC 되어있는 loadUserbyUserName 함수가 실행.
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService{
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    //시큐리티 session(내부 Authentication(내부 UserDetails))
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email);
        if(userEntity == null) {
            throw new UsernameNotFoundException("User not found with username: " + email);
        }
        UserDTO userDTO = modelMapper.map(userEntity, UserDTO.class);
        return new PrincipalDetails(userDTO);
    }
}