package app.service;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import app.dto.InstalacionUpdateCommand;
import app.exception.LocationNotFoundException;
import app.exception.LocationTypeMismatchException;
import app.model.FacilityType;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.model.OperationalStatus;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link InstalacionService}.
 */
@ExtendWith(MockitoExtension.class)
class InstalacionServiceTest {

    @Mock
    private MapLocationRepository mapLocationRepository;

    @Mock
    private InstalacionRepository instalacionRepository;

    @InjectMocks
    private InstalacionService instalacionService;

    @Test
    void updateMetadata_success() {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion instalacion = new Instalacion(location, FacilityType.BUILDING);

        when(mapLocationRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(location));
        when(instalacionRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(instalacion));

        InstalacionUpdateCommand cmd = new InstalacionUpdateCommand(
                "Edificio D - Actualizado",
                "Descripcion actualizada",
                "Aulas y laboratorios",
                "Ingenieria en Software",
                3,
                OperationalStatus.ACTIVE
        );

        instalacionService.updateMetadata("edificio-d", cmd);

        assertThat(location.getDisplayName()).isEqualTo("Edificio D - Actualizado");
        assertThat(location.getDescription()).isEqualTo("Descripcion actualizada");
        assertThat(instalacion.getUseDescription()).isEqualTo("Aulas y laboratorios");
        assertThat(instalacion.getAcademicPrograms()).isEqualTo("Ingenieria en Software");
        assertThat(instalacion.getFloorCount()).isEqualTo(3);
        assertThat(instalacion.getOperationalStatus()).isEqualTo(OperationalStatus.ACTIVE);

        verify(mapLocationRepository).save(location);
        verify(instalacionRepository).save(instalacion);
    }

    @Test
    void updateMetadata_unknownKey_throwsNotFound() {
        when(mapLocationRepository.findByMapKey("nonexistent")).thenReturn(Optional.empty());

        InstalacionUpdateCommand cmd = new InstalacionUpdateCommand(
                "Name", "Desc", "Use", "Programs", 1, OperationalStatus.ACTIVE
        );

        assertThatThrownBy(() -> instalacionService.updateMetadata("nonexistent", cmd))
                .isInstanceOf(LocationNotFoundException.class)
                .hasMessageContaining("nonexistent");
    }

    @Test
    void updateMetadata_wrongType_throwsMismatch() {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");

        when(mapLocationRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(location));

        InstalacionUpdateCommand cmd = new InstalacionUpdateCommand(
                "Name", "Desc", "Use", "Programs", 1, OperationalStatus.ACTIVE
        );

        assertThatThrownBy(() -> instalacionService.updateMetadata("zona-verde-sur", cmd))
                .isInstanceOf(LocationTypeMismatchException.class)
                .hasMessageContaining("zona-verde-sur");
    }
}
