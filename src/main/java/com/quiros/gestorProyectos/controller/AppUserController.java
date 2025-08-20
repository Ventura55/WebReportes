package com.quiros.gestorProyectos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quiros.gestorProyectos.DTO.UserDTO;
import com.quiros.gestorProyectos.entity.AppUser;
import com.quiros.gestorProyectos.repository.AppUserRepository;
import com.quiros.gestorProyectos.request.CreateUserRequest;
import com.quiros.gestorProyectos.service.AppUserDetailsService;

@RestController
@RequestMapping("/api/user")
public class AppUserController {

    @Autowired
    private AppUserDetailsService appUserDetailsService;

    @Autowired
    private AppUserRepository appUserRepository;

    @GetMapping("/info")
    public UserDTO getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        AppUser appUser = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        return new UserDTO(
                appUser.getId(),
                appUser.getUsername(),
                appUser.getGmail(),
                appUser.getRol());
    }

    @GetMapping("/info/all")
    public List<AppUser> getAllAppUser() {
        return appUserRepository.findAll();
    }

    @PostMapping("/create/user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        AppUser user = appUserDetailsService.createUser(request.getUsername(), request.getGmail(),
                request.getPassword(), request.getRol());
        return ResponseEntity.ok("Usuario creado con ID: " + user.getId());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody AppUser updateUser) {
        try {
            AppUser user = appUserDetailsService.updateUser(updateUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
