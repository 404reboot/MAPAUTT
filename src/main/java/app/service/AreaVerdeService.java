package app.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.dto.AreaVerdeUpdateCommand;
import app.exception.LocationNotFoundException;
import app.exception.LocationTypeMismatchException;
import app.model.AreaVerde;
import app.model.LocationType;
import app.model.MapLocation;
import app.repository.AreaVerdeRepository;
import app.repository.MapLocationRepository;

/**
 * Service responsible for updating metadata on green-area locations.
 * Only display/metadata fields may be modified; identity fields (mapKey,
 * glbObjectName, locationType, active) are immutable through this interface.
 */
@Service
@Transactional
public class AreaVerdeService {

    private final MapLocationRepository mapLocationRepository;
    private final AreaVerdeRepository areaVerdeRepository;

    public AreaVerdeService(MapLocationRepository mapLocationRepository,
                            AreaVerdeRepository areaVerdeRepository) {
        this.mapLocationRepository = mapLocationRepository;
        this.areaVerdeRepository = areaVerdeRepository;
    }

    /**
     * Updates the display metadata for a green area identified by its map key.
     *
     * @param mapKey the stable application key
     * @param cmd    validated command containing the new field values
     * @throws LocationNotFoundException      if no location exists with the given key
     * @throws LocationTypeMismatchException  if the location is not of type AREA_VERDE
     */
    public void updateMetadata(String mapKey, AreaVerdeUpdateCommand cmd) {
        MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new LocationNotFoundException(mapKey));

        if (location.getLocationType() != LocationType.AREA_VERDE) {
            throw new LocationTypeMismatchException(
                    mapKey, LocationType.AREA_VERDE, location.getLocationType());
        }

        AreaVerde areaVerde = areaVerdeRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new LocationNotFoundException(mapKey));

        // Update shared display fields on MapLocation
        location.setDisplayName(cmd.displayName());
        location.setDescription(cmd.description());

        // Update green-area-specific metadata
        areaVerde.setSector(cmd.sector());
        areaVerde.setSurfaceArea(cmd.surfaceArea());

        mapLocationRepository.save(location);
        areaVerdeRepository.save(areaVerde);
    }
}
