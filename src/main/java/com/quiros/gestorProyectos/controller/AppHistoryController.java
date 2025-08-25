package com.quiros.gestorProyectos.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quiros.gestorProyectos.entity.AppHistory;
import com.quiros.gestorProyectos.entity.AppProyect;
import com.quiros.gestorProyectos.entity.AppReport;
import com.quiros.gestorProyectos.entity.AppReportComplete;
import com.quiros.gestorProyectos.entity.AppTask;
import com.quiros.gestorProyectos.repository.AppHistoryRepository;
import com.quiros.gestorProyectos.repository.AppProyectRepository;
import com.quiros.gestorProyectos.repository.AppReportCompleteRepository;
import com.quiros.gestorProyectos.repository.AppReportRepository;
import com.quiros.gestorProyectos.repository.AppTaskRepository;
import com.quiros.gestorProyectos.request.CreateHistoryRequest;
import com.quiros.gestorProyectos.request.CreateProyectRequest;
import com.quiros.gestorProyectos.request.CreateReportRequest;
import com.quiros.gestorProyectos.request.CreateTaskRequest;
import com.quiros.gestorProyectos.service.AppHistoryDetailsService;
import com.quiros.gestorProyectos.service.AppProyectDetailsService;
import com.quiros.gestorProyectos.service.AppReportDetailsService;
import com.quiros.gestorProyectos.service.AppTaskDetailsService;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://tareas.quirosingenieria.es:80")
public class AppHistoryController {

    @Autowired
    private AppHistoryRepository appHistoryRepository;

    @Autowired
    private AppHistoryDetailsService appHistoryDetailsService;

    @Autowired
    private AppProyectRepository appProyectRepository;

    @Autowired
    private AppProyectDetailsService appProyectDetailsService;

    @Autowired
    private AppTaskRepository appTaskRepository;

    @Autowired
    private AppTaskDetailsService appTaskDetailsService;

    @Autowired
    private AppReportRepository appReportRepository;

    @Autowired
    private AppReportDetailsService appReportDetailsService;

    @Autowired
    private AppReportCompleteRepository appReportCompleteRepository;

    @GetMapping
    public List<AppHistory> getAll() {
        return appHistoryRepository.findAll();
    }

    @GetMapping("/proyect")
    public List<AppProyect> getAllAppProyects() {
        return appProyectRepository.findAll();
    }

    @GetMapping("/task")
    public List<AppTask> getAllAppTask() {
        return appTaskRepository.findAll();
    }

    @GetMapping("/report")
    public List<AppReport> getAllAppReports() {
        return appReportRepository.findAll();
    }

    @GetMapping("/report/complete")
    public List<AppReportComplete> getAllAppReportCompletes() {
        return appReportCompleteRepository.findAll();
    }

    @PostMapping("/create/history")
    public ResponseEntity<?> createHistory(@RequestBody CreateHistoryRequest request) {
        AppHistory history = appHistoryDetailsService.createHistory(request.getUsername(), request.getProyect(),
                request.getTask(), request.getHours(), request.getDescription());
        return ResponseEntity.ok("El historial fue creado con la id: " + history.getId());
    }

    @PostMapping("/create/proyect")
    public ResponseEntity<?> createProyect(@RequestBody CreateProyectRequest request) {
        AppProyect appProyect = appProyectDetailsService.createProyect(request.getProyect(), request.getDescription(),
                request.getComplete());
        return ResponseEntity.ok("El proyecto fue creado, " + appProyect);
    }

    @DeleteMapping("/delete/proyect/{id}")
    public ResponseEntity<?> deleteProyect(@PathVariable Long id) {
        appProyectDetailsService.deleteProyectById(id);
        return ResponseEntity.ok("Proyecto eliminado con ID: " + id);
    }

    @PutMapping("/update/proyect/{id}")
    public ResponseEntity<String> updateProyectStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Optional<AppProyect> optionalProyect = appProyectRepository.findById(id);
        if (optionalProyect.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Proyecto no encontrado");
        }

        AppProyect proyect = optionalProyect.get();

        Object completedValue = body.get("completed");
        if (completedValue instanceof Number) {
            int completed = ((Number) completedValue).intValue();
            proyect.setComplete(completed);
            appProyectRepository.save(proyect);
            return ResponseEntity.ok("Proyecto actualizado correctamente");
        } else {
            return ResponseEntity.badRequest().body("Campo 'completed' invalido");
        }
    }

    @PostMapping("/create/task")
    public ResponseEntity<?> createTask(@RequestBody CreateTaskRequest request) {
        AppTask appTask = appTaskDetailsService.createTask(request.getTask());
        return ResponseEntity.ok("La tarea fue creada: " + appTask.getTask());
    }

    @DeleteMapping("/delete/task/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        appTaskDetailsService.deleteTaskById(id);
        return ResponseEntity.ok("Tarea eliminada con ID: " + id);
    }

    // Reportes
    @PostMapping("/create/report")
    public ResponseEntity<?> createReport(@RequestBody CreateReportRequest request) {
        AppReport appReport = appReportDetailsService.createReport(request.getPriority(), request.getCompany(),
                request.getLocation(), request.getDate(), request.getDescription());
        return ResponseEntity.ok("El reporte fue creado: " + appReport.getCompany());
    }

    @DeleteMapping("/delete/report/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        appReportDetailsService.deleteReportById(id);
        return ResponseEntity.ok("El reporte fue eliminado");
    }

    @PostMapping("/complete/report/{id}")
    public ResponseEntity<?> completeReport(@PathVariable Long id) {
        try {
            boolean success = appReportDetailsService.moveToCompletedAndDelete(id);
            if (success) {
                return ResponseEntity.ok("Reporte movido a completados y eliminado del activo");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reporte no encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace(); // imprime el error en la consola del backend
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al completar el reporte: " + e.getMessage());
        }
    }
}
