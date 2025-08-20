package com.quiros.gestorProyectos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tareas_gestion_proyectos")
public class AppTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Long id;

    @Column(name = "gestion_operador_tarea")
    private String operatorTask;

    @Column(name = "tarea")
    private String task;

    public AppTask() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperatorTask() {
        return operatorTask;
    }

    public void setOperatorTask(String operatorTask) {
        this.operatorTask = operatorTask;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }
    
}
