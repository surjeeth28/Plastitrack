package com.plastitrack.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PickupRequest(
        @NotBlank String area,
        @Min(1) double weightKg,
        @NotBlank String plasticType
) {
}
