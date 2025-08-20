package com.quiros.gestorProyectos.DTO;

public class UserDTO {
    private Long id;
    private String username;
    private String gmail;
    private String rol;

    public UserDTO(Long id, String username, String gmail, String rol) {
        this.id = id;
        this.username = username;
        this.gmail = gmail;
        this.rol = rol;
    }

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getGmail() { return gmail; }
    public void setEmail(String gmail) { this.gmail = gmail; }

    public String getRol() { return rol; }
    public void setRole(String rol) { this.rol = rol; }
}
