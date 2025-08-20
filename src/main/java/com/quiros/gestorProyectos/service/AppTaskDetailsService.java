package com.quiros.gestorProyectos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quiros.gestorProyectos.entity.AppTask;
import com.quiros.gestorProyectos.repository.AppTaskRepository;

@Service
public class AppTaskDetailsService {
    private final AppTaskRepository appTaskRepository;

    @Autowired
    public AppTaskDetailsService(AppTaskRepository appTaskRepository) {
        this.appTaskRepository = appTaskRepository;
    }

    public AppTask createTask(String task) {
        AppTask appTask = new AppTask();
        appTask.setTask(task);

        return appTaskRepository.save(appTask);
    }

    public void deleteTaskById(Long id) {
        if (!appTaskRepository.existsById(id)) {
            throw new RuntimeException("La tarea no existe con id: " + id);
        }
        appTaskRepository.deleteById(id);
    }
}
