package com.plastitrack.service;

import com.plastitrack.entity.PickupRequestEntity;
import com.plastitrack.model.CommunityEvent;
import com.plastitrack.model.DashboardStat;
import com.plastitrack.model.ImpactMetric;
import com.plastitrack.model.ModuleInfo;
import com.plastitrack.model.PickupRequest;
import com.plastitrack.model.PickupResponse;
import com.plastitrack.repository.PickupRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PlastitrackService {
    private final PickupRequestRepository pickupRequestRepository;

    private final Map<String, Integer> rewardRates = Map.of(
            "PET bottles", 12,
            "HDPE containers", 14,
            "Mixed household plastic", 9,
            "Packaging film", 7
    );

    public PlastitrackService(PickupRequestRepository pickupRequestRepository) {
        this.pickupRequestRepository = pickupRequestRepository;
    }

    public List<DashboardStat> getDashboardStats() {
        List<PickupRequestEntity> pickups = pickupRequestRepository.findAll();
        long totalRequests = pickups.size();
        double totalWeight = pickups.stream()
                .mapToDouble(PickupRequestEntity::getWeightKg)
                .sum();
        int totalPoints = pickups.stream()
                .mapToInt(PickupRequestEntity::getEstimatedRewardPoints)
                .sum();
        double co2Avoided = totalWeight * 2.5;

        return List.of(
                new DashboardStat("Plastic collected", String.format("%.1f kg", totalWeight)),
                new DashboardStat("Reward points issued", String.valueOf(totalPoints)),
                new DashboardStat("CO2e avoided", String.format("%.1f kg", co2Avoided)),
                new DashboardStat("Pickup requests", String.valueOf(totalRequests))
        );
    }

    public List<ModuleInfo> getModules() {
        return List.of(
                new ModuleInfo("user", "User Module", "Register, request pickups, track rewards, and view collection history.", List.of("Registration", "Pickup booking", "Reward wallet")),
                new ModuleInfo("collector", "Collector Module", "Accept jobs, verify loads, and manage handover to recycling partners.", List.of("Route queue", "Load verification", "Handover tracking")),
                new ModuleInfo("admin", "Administrator Module", "Manage users, collectors, rates, reward partners, and reports.", List.of("User oversight", "Rate management", "Reports")),
                new ModuleInfo("reward", "Reward Management Module", "Convert verified plastic collections into reward points and redemptions.", List.of("Points calculator", "Partner catalog", "Fraud controls")),
                new ModuleInfo("impact", "Environmental Impact Module", "Calculate diversion, recycling throughput, CO2e savings, and participation.", List.of("CO2e estimates", "Diversion dashboard", "Impact certificates")),
                new ModuleInfo("community", "Community Module", "Support campaigns, cleanup events, leaderboards, and announcements.", List.of("Events", "Leaderboards", "Announcements"))
        );
    }

    public PickupResponse createPickup(PickupRequest request) {
        int rate = rewardRates.getOrDefault(request.plasticType(), 8);
        int points = (int) Math.round(request.weightKg() * rate);

        PickupRequestEntity pickup = new PickupRequestEntity();
        pickup.setArea(request.area());
        pickup.setWeightKg(request.weightKg());
        pickup.setPlasticType(request.plasticType());
        pickup.setEstimatedRewardPoints(points);
        pickup.setStatus("REQUESTED");
        pickup.setCreatedAt(LocalDateTime.now());

        PickupRequestEntity savedPickup = pickupRequestRepository.save(pickup);
        String message = "Pickup #" + savedPickup.getId() + " created for " + request.weightKg() + " kg of " + request.plasticType() + " in " + request.area() + ".";
        return new PickupResponse(String.valueOf(savedPickup.getId()), savedPickup.getStatus(), points, message);
    }

    public List<PickupRequestEntity> getRecentPickups() {
        return pickupRequestRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public List<ImpactMetric> getImpactMetrics() {
        return List.of(
                new ImpactMetric("Landfill diversion", 78),
                new ImpactMetric("Verified recycling", 64),
                new ImpactMetric("Community participation", 83)
        );
    }

    public List<CommunityEvent> getCommunityEvents() {
        return List.of(
                new CommunityEvent("Saturday Clean Drive", "24 volunteers registered for a ward cleanup.", 190),
                new CommunityEvent("School Bottle Bank", "Reward pool sponsored for student teams.", 120),
                new CommunityEvent("Market Zone Sorting Camp", "Collector training and on-site verification.", 160)
        );
    }
}
