package com.quiros.gestorProyectos.request;

public class CreateProyectRequest {
    private String priority;
    private String subPriority;
    private String proyect;
    private String dateStart;
    private String dateEnd;
    private String description;
    private int complete;

    public CreateProyectRequest() {
    }
    
    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
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

    public void setSubPriority(String subPriority) {
        this.subPriority = subPriority;
    }

    public String getSubPriority() {
        return subPriority;
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

    public int getComplete() {
        return complete;
    }

    public void setComplete(int complete) {
        this.complete = complete;
    }
    
}
