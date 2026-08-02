package app.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Sealed interface for polymorphic location detail payloads.
 * Uses Jackson {@code @JsonTypeInfo} with the enclosing DTO's {@code locationType}
 * field as the external discriminator. This provides a contractually defined
 * serialization shape for clients and code generators.
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.DEDUCTION
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = InstalacionDetailDto.class),
        @JsonSubTypes.Type(value = AreaVerdeDetailDto.class)
})
public sealed interface LocationDetails permits InstalacionDetailDto, AreaVerdeDetailDto {
}
