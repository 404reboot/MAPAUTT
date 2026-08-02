package app.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import app.dto.LocationDetailDto;
import app.dto.LocationSummaryDto;
import app.model.AreaVerde;
import app.model.FacilityType;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.model.OperationalStatus;
import app.repository.AreaVerdeRepository;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link MapLocationQueryService}.
 */
@ExtendWith(MockitoExtension.class)
class MapLocationQueryServiceTest {

    @Mock
    private MapLocationRepository mapLocationRepository;

    @Mock
    private InstalacionRepository instalacionRepository;

    @Mock
    private AreaVerdeRepository areaVerdeRepository;

    @InjectMocks
    private MapLocationQueryService queryService;

    @Test
    void getInventory_returnsAllActiveLocations() {
        MapLocation loc1 = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        MapLocation loc2 = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");

        when(mapLocationRepository.findAllByActiveTrue()).thenReturn(List.of(loc1, loc2));

        List<LocationSummaryDto> result = queryService.getInventory();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).mapKey()).isEqualTo("edificio-d");
        assertThat(result.get(0).glbObjectName()).isEqualTo("Edificio D.");
        assertThat(result.get(0).locationType()).isEqualTo(LocationType.INSTALACION);
        assertThat(result.get(0).displayName()).isEqualTo("Edificio D");
        assertThat(result.get(1).mapKey()).isEqualTo("zona-verde-sur");
        assertThat(result.get(1).locationType()).isEqualTo(LocationType.AREA_VERDE);
    }

    @Test
    void getDetail_withInstalacion_returnsDto() {
        MapLocation location = new MapLocation("cafeteria", "Cafeteria", LocationType.INSTALACION, "Cafeteria");
        location.setDescription("Cafeteria principal del campus");

        Instalacion instalacion = new Instalacion(location, FacilityType.SERVICE);
        instalacion.setUseDescription("Servicio de alimentos");
        instalacion.setAcademicPrograms("Todos los programas");
        instalacion.setFloorCount(1);
        instalacion.setOperationalStatus(OperationalStatus.ACTIVE);

        when(mapLocationRepository.findByMapKey("cafeteria")).thenReturn(Optional.of(location));
        when(instalacionRepository.findByMapKey("cafeteria")).thenReturn(Optional.of(instalacion));

        Optional<LocationDetailDto> result = queryService.getDetail("cafeteria");

        assertThat(result).isPresent();
        LocationDetailDto dto = result.get();
        assertThat(dto.mapKey()).isEqualTo("cafeteria");
        assertThat(dto.locationType()).isEqualTo(LocationType.INSTALACION);
        assertThat(dto.displayName()).isEqualTo("Cafeteria");
        assertThat(dto.description()).isEqualTo("Cafeteria principal del campus");
        assertThat(dto.details()).isNotNull();
    }

    @Test
    void getDetail_withAreaVerde_returnsDto() {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        location.setDescription("Area verde en la zona sur");

        AreaVerde areaVerde = new AreaVerde(location);
        areaVerde.setSector("Sur");
        areaVerde.setSurfaceArea(new BigDecimal("1500.50"));

        when(mapLocationRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(location));
        when(areaVerdeRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(areaVerde));

        Optional<LocationDetailDto> result = queryService.getDetail("zona-verde-sur");

        assertThat(result).isPresent();
        LocationDetailDto dto = result.get();
        assertThat(dto.mapKey()).isEqualTo("zona-verde-sur");
        assertThat(dto.locationType()).isEqualTo(LocationType.AREA_VERDE);
        assertThat(dto.displayName()).isEqualTo("Zona Verde Sur");
        assertThat(dto.description()).isEqualTo("Area verde en la zona sur");
        assertThat(dto.details()).isNotNull();
    }

    @Test
    void getDetail_withUnknownKey_returnsEmpty() {
        when(mapLocationRepository.findByMapKey("nonexistent")).thenReturn(Optional.empty());

        Optional<LocationDetailDto> result = queryService.getDetail("nonexistent");

        assertThat(result).isEmpty();
    }
}
