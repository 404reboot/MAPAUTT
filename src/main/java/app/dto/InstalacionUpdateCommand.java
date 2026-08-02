package app.dto;

import app.model.OperationalStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Command object for updating metadata on an installation-type location.
 * Only display/metadata fields are accepted; identity fields cannot be changed.
 */
public record InstalacionUpdateCommand(
        @NotBlank(message = "Display name must not be blank")
        @Size(max = 150, message = "Display name must not exceed 150 characters")
        String displayName,

        String description,

        @Size(max = 500, message = "Use description must not exceed 500 characters")
        String useDescription,

        String academicPrograms,

        @Min(value = 1, message = "Floor count must be at least 1")
        Integer floorCount,

        OperationalStatus operationalStatus
) {}
