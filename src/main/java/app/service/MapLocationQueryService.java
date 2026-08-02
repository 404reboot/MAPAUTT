package app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.dto.AreaVerdeDetailDto;
import app.dto.InstalacionDetailDto;
import app.dto.LocationDetailDto;
import app.dto.LocationSummaryDto;
import app.model.AreaVerde;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.repository.AreaVerdeRepository;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;

/**
 * Read-only query service for map locations. Maps JPA entities to DTOs
 * so that the domain model is never exposed directly through the API.
 */
@Service
@Transactional(readOnly = true)
public class MapLocationQueryService {

    private final MapLocationRepository mapLocationRepository;
    private final InstalacionRepository instalacionRepository;
    private final AreaVerdeRepository areaVerdeRepository;

    public MapLocationQueryService(MapLocationRepository mapLocationRepository,
                                   InstalacionRepository instalacionRepository,
                                   AreaVerdeRepository areaVerdeRepository) {
        this.mapLocationRepository = mapLocationRepository;
        this.instalacionRepository = instalacionRepository;
        this.areaVerdeRepository = areaVerdeRepository;
    }

    /**
     * Returns a lightweight inventory of all active map locations.
     */
    public List<LocationSummaryDto> getInventory() {
        return mapLocationRepository.findAllByActiveTrue().stream()
                .map(this::toSummary)
                .toList();
    }

    /**
     * Returns the full detail of a single location identified by its map key,
     * including type-specific metadata.
     */
    public Optional<LocationDetailDto> getDetail(String mapKey) {
        return mapLocationRepository.findByMapKey(mapKey)
                .map(this::toDetail);
    }

    private LocationSummaryDto toSummary(MapLocation location) {
        return new LocationSummaryDto(
                location.getMapKey(),
                location.getGlbObjectName(),
                location.getLocationType(),
                location.getDisplayName()
        );
    }

    private LocationDetailDto toDetail(MapLocation location) {
        Object details = switch (location.getLocationType()) {
            case INSTALACION -> instalacionRepository.findByMapKey(location.getMapKey())
                    .map(this::toInstalacionDetail)
                    .orElse(null);
            case AREA_VERDE -> areaVerdeRepository.findByMapKey(location.getMapKey())
                    .map(this::toAreaVerdeDetail)
                    .orElse(null);
        };

        return new LocationDetailDto(
                location.getMapKey(),
                location.getLocationType(),
                location.getDisplayName(),
                location.getDescription(),
                details
        );
    }

    private InstalacionDetailDto toInstalacionDetail(Instalacion inst) {
        return new InstalacionDetailDto(
                inst.getFacilityType(),
                inst.getUseDescription(),
                inst.getAcademicPrograms(),
                inst.getFloorCount(),
                inst.getOperationalStatus()
        );
    }

    private AreaVerdeDetailDto toAreaVerdeDetail(AreaVerde av) {
        return new AreaVerdeDetailDto(
                av.getSector(),
                av.getSurfaceArea()
        );
    }
}
