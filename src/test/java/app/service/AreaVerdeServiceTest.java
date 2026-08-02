package app.service;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import app.dto.AreaVerdeUpdateCommand;
import app.exception.LocationNotFoundException;
import app.exception.LocationTypeMismatchException;
import app.model.AreaVerde;
import app.model.LocationType;
import app.model.MapLocation;
import app.repository.AreaVerdeRepository;
import app.repository.MapLocationRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link AreaVerdeService}.
 */
@ExtendWith(MockitoExtension.class)
class AreaVerdeServiceTest {

    @Mock
    private MapLocationRepository mapLocationRepository;

    @Mock
    private AreaVerdeRepository areaVerdeRepository;

    @InjectMocks
    private AreaVerdeService areaVerdeService;

    @Test
    void updateMetadata_success() {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        AreaVerde areaVerde = new AreaVerde(location);

        when(mapLocationRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(location));
        when(areaVerdeRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(areaVerde));

        AreaVerdeUpdateCommand cmd = new AreaVerdeUpdateCommand(
                "Zona Verde Sur - Actualizada",
                "Descripcion actualizada",
                "Sector Sur",
                new BigDecimal("2500.75")
        );

        areaVerdeService.updateMetadata("zona-verde-sur", cmd);

        assertThat(location.getDisplayName()).isEqualTo("Zona Verde Sur - Actualizada");
        assertThat(location.getDescription()).isEqualTo("Descripcion actualizada");
        assertThat(areaVerde.getSector()).isEqualTo("Sector Sur");
        assertThat(areaVerde.getSurfaceArea()).isEqualByComparingTo(new BigDecimal("2500.75"));

        verify(mapLocationRepository).save(location);
        verify(areaVerdeRepository).save(areaVerde);
    }

    @Test
    void updateMetadata_unknownKey_throwsNotFound() {
        when(mapLocationRepository.findByMapKey("nonexistent")).thenReturn(Optional.empty());

        AreaVerdeUpdateCommand cmd = new AreaVerdeUpdateCommand(
                "Name", "Desc", "Sector", new BigDecimal("100.00")
        );

        assertThatThrownBy(() -> areaVerdeService.updateMetadata("nonexistent", cmd))
                .isInstanceOf(LocationNotFoundException.class)
                .hasMessageContaining("nonexistent");
    }

    @Test
    void updateMetadata_wrongType_throwsMismatch() {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");

        when(mapLocationRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(location));

        AreaVerdeUpdateCommand cmd = new AreaVerdeUpdateCommand(
                "Name", "Desc", "Sector", new BigDecimal("100.00")
        );

        assertThatThrownBy(() -> areaVerdeService.updateMetadata("edificio-d", cmd))
                .isInstanceOf(LocationTypeMismatchException.class)
                .hasMessageContaining("edificio-d");
    }
}
