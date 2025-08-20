package com.quiros.gestorProyectos.request;

public class CreateProyectRequest {
    private String proyect;
    private String description;
    private int complete;

    public CreateProyectRequest() {
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
