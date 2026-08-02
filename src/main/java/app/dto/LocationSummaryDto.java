package app.dto;

import app.model.LocationType;

/**
 * Lightweight projection used in the inventory listing endpoint.
 */
public record LocationSummaryDto(
        String mapKey,
        String glbObjectName,
        LocationType locationType,
        String displayName
) {}
