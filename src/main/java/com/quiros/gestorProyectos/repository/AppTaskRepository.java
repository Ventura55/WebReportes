package com.quiros.gestorProyectos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quiros.gestorProyectos.entity.AppTask;

@Repository
public interface AppTaskRepository extends JpaRepository<AppTask, Long> {
    
}
