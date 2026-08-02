package app.service;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import app.model.AreaVerde;
import app.model.FacilityType;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.repository.AreaVerdeRepository;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;
import app.service.MapInventoryRegistry.RegistryEntry;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link MapInventoryValidator}.
 * Verifies warn-vs-fail mode behavior and detection of inventory mismatches.
 */
@ExtendWith(MockitoExtension.class)
class MapInventoryValidatorTest {

    @Mock
    private MapInventoryRegistry registry;

    @Mock
    private MapLocationRepository mapLocationRepository;

    @Mock
    private InstalacionRepository instalacionRepository;

    @Mock
    private AreaVerdeRepository areaVerdeRepository;

    @Test
    void validateInventory_allMatched_passes() {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(location, FacilityType.BUILDING);

        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of(location));
        when(instalacionRepository.findAll()).thenReturn(List.of(inst));
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatCode(validator::validateInventory).doesNotThrowAnyException();
    }

    @Test
    void validateInventory_missingDbRecord_warnMode_doesNotThrow() {
        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of());
        when(instalacionRepository.findAll()).thenReturn(List.of());
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "warn");

        assertThatCode(validator::validateInventory).doesNotThrowAnyException();
    }

    @Test
    void validateInventory_missingDbRecord_failMode_throws() {
        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of());
        when(instalacionRepository.findAll()).thenReturn(List.of());
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatThrownBy(validator::validateInventory)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("1 issue(s)");
    }

    @Test
    void validateInventory_glbObjectNameMismatch_failMode_throws() {
        MapLocation location = new MapLocation("edificio-d", "Edificio D - WRONG.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(location, FacilityType.BUILDING);

        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of(location));
        when(instalacionRepository.findAll()).thenReturn(List.of(inst));
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatThrownBy(validator::validateInventory)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("issue(s)");
    }

    @Test
    void validateInventory_extraActiveDbRecord_failMode_throws() {
        MapLocation registered = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(registered, FacilityType.BUILDING);

        MapLocation extra = new MapLocation("extra-location", "Extra.", LocationType.INSTALACION, "Extra");

        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of(registered, extra));
        when(instalacionRepository.findAll()).thenReturn(List.of(inst));
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatThrownBy(validator::validateInventory)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("issue(s)");
    }

    @Test
    void validateInventory_missingSubtypeDetail_failMode_throws() {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");

        RegistryEntry entry = new RegistryEntry("edificio-d", "Edificio D.", "INSTALACION", "BUILDING", "Edificio D");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of(location));
        when(instalacionRepository.findAll()).thenReturn(List.of()); // No instalacion detail
        when(areaVerdeRepository.findAll()).thenReturn(List.of());

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatThrownBy(validator::validateInventory)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("issue(s)");
    }

    @Test
    void validateInventory_areaVerde_allMatched_passes() {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        AreaVerde av = new AreaVerde(location);

        RegistryEntry entry = new RegistryEntry("zona-verde-sur", "Zona Verde Sur", "AREA_VERDE", null, "Zona Verde Sur");

        when(registry.getAllEntries()).thenReturn(List.of(entry));
        when(mapLocationRepository.findAll()).thenReturn(List.of(location));
        when(instalacionRepository.findAll()).thenReturn(List.of());
        when(areaVerdeRepository.findAll()).thenReturn(List.of(av));

        MapInventoryValidator validator = new MapInventoryValidator(
                registry, mapLocationRepository, instalacionRepository, areaVerdeRepository, "fail");

        assertThatCode(validator::validateInventory).doesNotThrowAnyException();
    }
}
