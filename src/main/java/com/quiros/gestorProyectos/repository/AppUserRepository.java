package com.quiros.gestorProyectos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quiros.gestorProyectos.entity.AppUser;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsername(String user);
}