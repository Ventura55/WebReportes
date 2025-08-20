package com.quiros.gestorProyectos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "reportes_completados")
public class AppReportComplete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Long id;

    @Column(name = "empresa_reporte")
    private String company;

    @Column(name = "ubicacion_reporte")
    private String location;

    @Column(name = "fecha_reporte")
    private String date;

    @Column(name = "descripcion_reporte")
    private String description;

    public AppReportComplete() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
}
