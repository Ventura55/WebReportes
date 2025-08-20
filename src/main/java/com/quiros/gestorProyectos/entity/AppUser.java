package com.quiros.gestorProyectos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "login_web")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_web")
    private Long id;
    
    @Column(name = "usuario_web")
    private String username;

    @Column(name = "correo_web")
    private String gmail;

    @Column(name = "contraseña_web")
    private String password;

    @Column(name = "rol_web")
    private String rol;
    
    public AppUser() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }
}