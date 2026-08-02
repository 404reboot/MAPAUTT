package app.dto;

import java.math.BigDecimal;

/**
 * Type-specific detail projection for green-area locations.
 */
public record AreaVerdeDetailDto(
        String sector,
        BigDecimal surfaceArea
) implements LocationDetails {}
