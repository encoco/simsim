package com.example.project.Repository;

import com.example.project.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    boolean existsByEmail(String email);
    UserEntity findByEmail(String email);
}
