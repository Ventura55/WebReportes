package com.quiros.gestorProyectos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quiros.gestorProyectos.entity.AppHistory;
import com.quiros.gestorProyectos.repository.AppHistoryRepository;

@Service
public class AppHistoryDetailsService {
    private final AppHistoryRepository appHistoryRepository;

    @Autowired
    public AppHistoryDetailsService(AppHistoryRepository appHistoryRepository) {
        this.appHistoryRepository = appHistoryRepository;
    }

    public AppHistory createHistory(String username, String proyect, String task, double hours, String description) {
        AppHistory history = new AppHistory();
        history.setUser(username);
        history.setProyect(proyect);
        history.setTask(task);
        history.setHours(hours);
        history.setDescription(description);

        return appHistoryRepository.save(history);
    }
}
