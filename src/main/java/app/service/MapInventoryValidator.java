package app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import app.model.AreaVerde;
import app.model.Instalacion;
import app.model.MapLocation;
import app.repository.AreaVerdeRepository;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;
import app.service.MapInventoryRegistry.RegistryEntry;

/**
 * Validates that the database inventory is consistent with the authoritative
 * map-locations.json registry at application startup.
 *
 * <p>All database records are batch-fetched in 3 queries (map_location,
 * instalacion, area_verde) and validated in memory to avoid N+1 query overhead.
 *
 * <p>Behavior is controlled by {@code app.inventory.validation-mode}:
 * <ul>
 *   <li>{@code warn} (default) - logs warnings for each mismatch but allows startup</li>
 *   <li>{@code fail} - logs errors and throws an exception to prevent startup</li>
 * </ul>
 */
@Component
public class MapInventoryValidator {

    private static final Logger log = LoggerFactory.getLogger(MapInventoryValidator.class);

    private final MapInventoryRegistry registry;
    private final MapLocationRepository mapLocationRepository;
    private final InstalacionRepository instalacionRepository;
    private final AreaVerdeRepository areaVerdeRepository;
    private final String validationMode;

    public MapInventoryValidator(MapInventoryRegistry registry,
                                 MapLocationRepository mapLocationRepository,
                                 InstalacionRepository instalacionRepository,
                                 AreaVerdeRepository areaVerdeRepository,
                                 @Value("${app.inventory.validation-mode:warn}") String validationMode) {
        this.registry = registry;
        this.mapLocationRepository = mapLocationRepository;
        this.instalacionRepository = instalacionRepository;
        this.areaVerdeRepository = areaVerdeRepository;
        this.validationMode = validationMode;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void validateInventory() {
        log.info("Starting inventory validation (mode={})", validationMode);

        // Batch-fetch all records in 3 queries
        Map<String, MapLocation> locationsByMapKey = mapLocationRepository.findAll().stream()
                .collect(Collectors.toMap(MapLocation::getMapKey, Function.identity()));

        Map<String, Instalacion> instalacionesByMapKey = instalacionRepository.findAll().stream()
                .collect(Collectors.toMap(
                        inst -> inst.getMapLocation().getMapKey(),
                        Function.identity()));

        Map<String, AreaVerde> areasVerdesByMapKey = areaVerdeRepository.findAll().stream()
                .collect(Collectors.toMap(
                        av -> av.getMapLocation().getMapKey(),
                        Function.identity()));

        List<String> issues = new ArrayList<>();

        // Check every registry entry has a matching DB record
        for (RegistryEntry entry : registry.getAllEntries()) {
            MapLocation location = locationsByMapKey.get(entry.mapKey());

            if (location == null) {
                issues.add("Registry entry '%s' not found in database".formatted(entry.mapKey()));
                continue;
            }

            // Verify glbObjectName matches
            if (!entry.glbObjectName().equals(location.getGlbObjectName())) {
                issues.add("Registry entry '%s' has glbObjectName '%s' but DB has '%s'"
                        .formatted(entry.mapKey(), entry.glbObjectName(), location.getGlbObjectName()));
            }

            // Verify locationType matches
            String dbLocationType = location.getLocationType().name();
            if (!entry.locationType().equals(dbLocationType)) {
                issues.add("Registry entry '%s' has locationType '%s' but DB has '%s'"
                        .formatted(entry.mapKey(), entry.locationType(), dbLocationType));
            }

            // Verify subtype detail record exists
            if ("INSTALACION".equals(entry.locationType())) {
                if (!instalacionesByMapKey.containsKey(entry.mapKey())) {
                    issues.add("Registry entry '%s' is INSTALACION but has no detail record in instalacion table"
                            .formatted(entry.mapKey()));
                }
            } else if ("AREA_VERDE".equals(entry.locationType())) {
                if (!areasVerdesByMapKey.containsKey(entry.mapKey())) {
                    issues.add("Registry entry '%s' is AREA_VERDE but has no detail record in area_verde table"
                            .formatted(entry.mapKey()));
                }
            }
        }

        // Check for extra active DB records not in registry
        Set<String> registryKeys = registry.getAllEntries().stream()
                .map(RegistryEntry::mapKey)
                .collect(Collectors.toSet());

        for (MapLocation location : locationsByMapKey.values()) {
            if (Boolean.TRUE.equals(location.getActive()) && !registryKeys.contains(location.getMapKey())) {
                issues.add("Active DB record '%s' (glb='%s') is not defined in registry"
                        .formatted(location.getMapKey(), location.getGlbObjectName()));
            }
        }

        // Report results
        if (issues.isEmpty()) {
            log.info("Inventory validation passed: {} registry entries verified against database",
                    registry.getAllEntries().size());
            return;
        }

        if ("fail".equalsIgnoreCase(validationMode)) {
            issues.forEach(issue -> log.error("INVENTORY MISMATCH: {}", issue));
            throw new IllegalStateException(
                    "Inventory validation failed with %d issue(s). See log for details.".formatted(issues.size()));
        } else {
            issues.forEach(issue -> log.warn("INVENTORY MISMATCH: {}", issue));
            log.warn("Inventory validation completed with {} warning(s) (mode=warn, startup continues)",
                    issues.size());
        }
    }
}
