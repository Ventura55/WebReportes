package com.quiros.gestorProyectos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "gestion_proyectos")
public class AppProyect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Long id;

    @Column(name = "prioridad_tarea")
    private String priority;

    @Column(name = "subprioridad_tarea")
    private int subpriority;

    @Column(name = "proyecto_tarea")
    private String proyect;

    @Column(name = "fecha_tarea")
    private String dateStart;

    @Column(name = "fecha_final_tarea")
    private String dateEnd;

    @Column(name = "descripcion_tarea")
    private String description;

    @Column(name = "horas_tarea")
    private String hours;

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

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public int getSubpriority() {
        return subpriority;
    }

    public void setSubpriority(int subpriority) {
        this.subpriority = subpriority;
    }

    public String getProyect() {
        return proyect;
    }

    public void setProyect(String proyect) {
        this.proyect = proyect;
    }
    
    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getHours() {
        return hours;
    }

    public void setHours() {
        this.hours = hours;
    }

    public int getComplete() {
        return complete;
    }

    public void setComplete(int complete) {
        this.complete = complete;
    }
}
