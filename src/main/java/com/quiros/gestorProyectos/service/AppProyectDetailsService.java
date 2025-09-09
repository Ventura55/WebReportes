package com.quiros.gestorProyectos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quiros.gestorProyectos.entity.AppProyect;
import com.quiros.gestorProyectos.repository.AppProyectRepository;

@Service
public class AppProyectDetailsService {
    private final AppProyectRepository appProyectRepository;

    @Autowired
    public AppProyectDetailsService(AppProyectRepository appProyectRepository) {
        this.appProyectRepository = appProyectRepository;
    }

    public AppProyect createProyect(String priority, String proyect, String dateStart, String dateEnd, String description, int complete) {
        AppProyect appProyect = new AppProyect();
        appProyect.setPriority(priority);
        appProyect.setProyect(proyect);
        appProyect.setDateStart(dateStart);
        appProyect.setDateEnd(dateEnd);
        appProyect.setDescription(description);
        appProyect.setComplete(complete);

        return appProyectRepository.save(appProyect);
    }

    public void deleteProyectById(Long id) {
        if (!appProyectRepository.existsById(id)) {
            throw new RuntimeException("La tarea no existe con Id:" + id);
        }
        appProyectRepository.deleteById(id);
    }

    public AppProyect editProyect(AppProyect editProyect) {
        AppProyect proyect = appProyectRepository.findById(editProyect.getId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        proyect.setProyect(editProyect.getProyect());
        proyect.setDateStart(editProyect.getDateStart());
        proyect.setDateEnd(editProyect.getDateEnd());
        proyect.setDescription(editProyect.getDescription());

        return appProyectRepository.save(proyect);
    }
}
