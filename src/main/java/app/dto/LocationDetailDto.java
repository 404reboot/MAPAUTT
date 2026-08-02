package app.dto;

import app.model.LocationType;

/**
 * Full detail view of a single map location, including type-specific metadata
 * nested in the {@code details} field (either {@link InstalacionDetailDto} or
 * {@link AreaVerdeDetailDto}).
 */
public record LocationDetailDto(
        String mapKey,
        LocationType locationType,
        String displayName,
        String description,
        LocationDetails details
) {}
