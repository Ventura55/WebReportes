package com.quiros.gestorProyectos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gestion_proyectos")
public class AppProyect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Long id;

    @Column(name = "proyecto_tarea")
    private String proyect;

    @Column(name = "descripcion_tarea")
    private String description;

    @Column(name = "completar_tarea")
    private int complete;

    public AppProyect() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProyect() {
        return proyect;
    }

    public void setProyect(String proyect) {
        this.proyect = proyect;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getComplete() {
        return complete;
    }

    public void setComplete(int complete) {
        this.complete = complete;
    }
    
}
