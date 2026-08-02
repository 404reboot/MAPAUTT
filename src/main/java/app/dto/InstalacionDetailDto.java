package app.dto;

import app.model.FacilityType;
import app.model.OperationalStatus;

/**
 * Type-specific detail projection for installation-type locations.
 */
public record InstalacionDetailDto(
        FacilityType facilityType,
        String useDescription,
        String academicPrograms,
        Integer floorCount,
        OperationalStatus operationalStatus
) implements LocationDetails {}
