package com.quiros.gestorProyectos.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quiros.gestorProyectos.entity.AppReport;
import com.quiros.gestorProyectos.entity.AppReportComplete;
import com.quiros.gestorProyectos.repository.AppReportCompleteRepository;
import com.quiros.gestorProyectos.repository.AppReportRepository;

@Service
public class AppReportDetailsService {
    private final AppReportRepository appReportRepository;
    private final AppReportCompleteRepository appReportCompleteRepository;

    @Autowired
    public AppReportDetailsService(AppReportRepository appReportRepository, AppReportCompleteRepository appReportCompleteRepository) {
        this.appReportRepository = appReportRepository;
        this.appReportCompleteRepository = appReportCompleteRepository;
    }

    public AppReport createReport(String priority, String company, String location, String date, String description) {
        AppReport appReport = new AppReport();
        appReport.setPriority(priority);
        appReport.setCompany(company);
        appReport.setLocation(location);
        appReport.setDate(date);
        appReport.setDescription(description);

        return appReportRepository.save(appReport);
    }

    public void deleteReportById(Long id) {
        if (!appReportRepository.existsById(id)) {
            throw new RuntimeException("La id no existe: " + id);
        }
        appReportRepository.deleteById(id);
    }

    public boolean moveToCompletedAndDelete(Long id) {
        Optional<AppReport> existing = appReportRepository.findById(id);

        if (existing.isPresent()) {
            AppReport report = existing.get();

            AppReportComplete completed = new AppReportComplete();
            completed.setCompany(report.getCompany());
            completed.setLocation(report.getLocation());
            completed.setDate(report.getDate());
            completed.setDescription(report.getDescription());

            appReportCompleteRepository.save(completed);

            appReportRepository.deleteById(id);

            return true;
        }

        return false;
    }
}
