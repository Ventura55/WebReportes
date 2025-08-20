package com.quiros.gestorProyectos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quiros.gestorProyectos.entity.AppReport;

@Repository
public interface AppReportRepository extends JpaRepository<AppReport, Long> {
    
}
