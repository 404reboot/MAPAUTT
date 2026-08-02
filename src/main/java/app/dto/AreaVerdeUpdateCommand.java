package app.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Command object for updating metadata on a green-area location.
 * Only display/metadata fields are accepted; identity fields cannot be changed.
 */
public record AreaVerdeUpdateCommand(
        @NotBlank(message = "Display name must not be blank")
        @Size(max = 150, message = "Display name must not exceed 150 characters")
        String displayName,

        String description,

        @Size(max = 100, message = "Sector must not exceed 100 characters")
        String sector,

        @DecimalMin(value = "0", message = "Surface area must not be negative")
        BigDecimal surfaceArea
) {}
