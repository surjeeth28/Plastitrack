package com.plastitrack.model;

import java.util.List;

public record ModuleInfo(
        String key,
        String title,
        String description,
        List<String> features
) {
}
