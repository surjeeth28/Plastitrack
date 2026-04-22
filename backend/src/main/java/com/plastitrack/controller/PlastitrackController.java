package com.plastitrack.controller;

import com.plastitrack.model.CommunityEvent;
import com.plastitrack.model.DashboardStat;
import com.plastitrack.model.ImpactMetric;
import com.plastitrack.model.ModuleInfo;
import com.plastitrack.model.PickupRequest;
import com.plastitrack.model.PickupResponse;
import com.plastitrack.service.PlastitrackService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class PlastitrackController {
    private final PlastitrackService service;

    public PlastitrackController(PlastitrackService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public List<DashboardStat> stats() {
        return service.getDashboardStats();
    }

    @GetMapping("/modules")
    public List<ModuleInfo> modules() {
        return service.getModules();
    }

    @PostMapping("/pickups")
    public PickupResponse createPickup(@Valid @RequestBody PickupRequest request) {
        return service.createPickup(request);
    }

    @GetMapping("/impact")
    public List<ImpactMetric> impact() {
        return service.getImpactMetrics();
    }

    @GetMapping("/community-events")
    public List<CommunityEvent> communityEvents() {
        return service.getCommunityEvents();
    }
}
