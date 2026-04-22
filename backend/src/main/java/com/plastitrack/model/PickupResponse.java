package com.plastitrack.model;

public record PickupResponse(
        String requestId,
        String status,
        int estimatedRewardPoints,
        String message
) {
}
