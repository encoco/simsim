package com.example.project.Service;

import com.example.project.DTO.UserDTO;
import com.example.project.Entity.UserEntity;
import com.example.project.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public boolean EmailCheck(String email){
        return repository.existsByEmail(email);
    }

    /**
     *
     * @param user 회원가입 시 넘어오는 유저 DTO
     * @return 회원가입 성공 시 T  //  실패 시 F
     */
    @Transactional
    public boolean signUp(UserDTO user) {
        try{
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            System.out.println(user.getPassword());
            repository.save(modelMapper.map(user, UserEntity.class));
            return true;
        }
        catch(Exception e){
            System.out.println("error : " + e);
            return false;
        }
    }
}
