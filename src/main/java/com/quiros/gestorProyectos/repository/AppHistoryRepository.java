package com.quiros.gestorProyectos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quiros.gestorProyectos.entity.AppHistory;

@Repository
public interface AppHistoryRepository extends JpaRepository<AppHistory, Long> {
    
}
