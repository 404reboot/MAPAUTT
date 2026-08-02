package app.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test that validates the map-locations.json registry file integrity
 * by loading it through the {@link MapInventoryRegistry} mechanism.
 */
class MapInventoryRegistryTest {

    private static MapInventoryRegistry registry;

    @BeforeAll
    static void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        registry = new MapInventoryRegistry(objectMapper);
    }

    @Test
    void registryLoads54Entries() {
        assertThat(registry.getAllEntries()).hasSize(54);
    }

    @Test
    void allMapKeysUnique() {
        List<MapInventoryRegistry.RegistryEntry> entries = registry.getAllEntries();
        Set<String> mapKeys = entries.stream()
                .map(MapInventoryRegistry.RegistryEntry::mapKey)
                .collect(Collectors.toSet());

        assertThat(mapKeys).hasSameSizeAs(entries);
    }

    @Test
    void allGlbObjectNamesUnique() {
        List<MapInventoryRegistry.RegistryEntry> entries = registry.getAllEntries();
        Set<String> glbNames = entries.stream()
                .map(MapInventoryRegistry.RegistryEntry::glbObjectName)
                .collect(Collectors.toSet());

        assertThat(glbNames).hasSameSizeAs(entries);
    }

    @Test
    void correctInstallationCount() {
        assertThat(registry.getInstallationEntries()).hasSize(29);
    }

    @Test
    void correctGreenAreaCount() {
        assertThat(registry.getGreenAreaEntries()).hasSize(25);
    }
}
