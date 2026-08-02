package app.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * In-memory registry of all map locations as defined in the authoritative
 * JSON inventory file (map/map-locations.json). Loaded once at construction
 * time and provides fast lookups by mapKey or glbObjectName.
 */
@Service
public class MapInventoryRegistry {

    /**
     * Represents a single entry from the map-locations.json registry.
     */
    public record RegistryEntry(
            String mapKey,
            String glbObjectName,
            String locationType,
            String facilityType,
            String defaultDisplayName
    ) {}

    private final List<RegistryEntry> entries;
    private final Map<String, RegistryEntry> byMapKey;
    private final Map<String, RegistryEntry> byGlbObjectName;

    public MapInventoryRegistry(ObjectMapper objectMapper) {
        try {
            ClassPathResource resource = new ClassPathResource("map/map-locations.json");
            try (InputStream is = resource.getInputStream()) {
                List<RawEntry> rawEntries = objectMapper.readValue(is, new TypeReference<List<RawEntry>>() {});
                this.entries = rawEntries.stream()
                        .map(raw -> new RegistryEntry(
                                raw.mapKey(),
                                raw.glbObjectName(),
                                raw.locationType(),
                                raw.facilityType(),
                                raw.defaultDisplayName()))
                        .toList();
            }
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load map-locations.json from classpath", e);
        }

        this.byMapKey = entries.stream()
                .collect(Collectors.toUnmodifiableMap(RegistryEntry::mapKey, Function.identity()));
        this.byGlbObjectName = entries.stream()
                .collect(Collectors.toUnmodifiableMap(RegistryEntry::glbObjectName, Function.identity()));
    }

    /**
     * Returns all registry entries in their original order.
     */
    public List<RegistryEntry> getAllEntries() {
        return Collections.unmodifiableList(entries);
    }

    /**
     * Looks up a registry entry by its stable application key.
     */
    public Optional<RegistryEntry> getByMapKey(String mapKey) {
        return Optional.ofNullable(byMapKey.get(mapKey));
    }

    /**
     * Looks up a registry entry by its GLB scene object name.
     */
    public Optional<RegistryEntry> getByGlbObjectName(String glbObjectName) {
        return Optional.ofNullable(byGlbObjectName.get(glbObjectName));
    }

    /**
     * Returns all entries classified as INSTALACION.
     */
    public List<RegistryEntry> getInstallationEntries() {
        return entries.stream()
                .filter(e -> "INSTALACION".equals(e.locationType()))
                .toList();
    }

    /**
     * Returns all entries classified as AREA_VERDE.
     */
    public List<RegistryEntry> getGreenAreaEntries() {
        return entries.stream()
                .filter(e -> "AREA_VERDE".equals(e.locationType()))
                .toList();
    }

    /**
     * Internal record matching the JSON structure for deserialization.
     */
    private record RawEntry(
            @JsonProperty("mapKey") String mapKey,
            @JsonProperty("glbObjectName") String glbObjectName,
            @JsonProperty("locationType") String locationType,
            @JsonProperty("facilityType") String facilityType,
            @JsonProperty("defaultDisplayName") String defaultDisplayName
    ) {}
}
