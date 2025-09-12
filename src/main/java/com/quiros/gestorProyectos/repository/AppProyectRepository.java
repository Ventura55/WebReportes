package com.quiros.gestorProyectos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.quiros.gestorProyectos.entity.AppProyect;

@Repository
public interface AppProyectRepository extends JpaRepository<AppProyect, Long> {

    Integer findMaxSubpriorityByPriority(@Param("priority") String priority);
}
