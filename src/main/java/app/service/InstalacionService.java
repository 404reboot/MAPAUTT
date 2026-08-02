package app.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.dto.InstalacionUpdateCommand;
import app.exception.LocationNotFoundException;
import app.exception.LocationTypeMismatchException;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;

/**
 * Service responsible for updating metadata on installation-type locations.
 * Only display/metadata fields may be modified; identity fields (mapKey,
 * glbObjectName, locationType, active) are immutable through this interface.
 */
@Service
@Transactional
public class InstalacionService {

    private final MapLocationRepository mapLocationRepository;
    private final InstalacionRepository instalacionRepository;

    public InstalacionService(MapLocationRepository mapLocationRepository,
                              InstalacionRepository instalacionRepository) {
        this.mapLocationRepository = mapLocationRepository;
        this.instalacionRepository = instalacionRepository;
    }

    /**
     * Updates the display metadata for an installation identified by its map key.
     *
     * @param mapKey the stable application key
     * @param cmd    validated command containing the new field values
     * @throws LocationNotFoundException      if no location exists with the given key
     * @throws LocationTypeMismatchException  if the location is not of type INSTALACION
     */
    public void updateMetadata(String mapKey, InstalacionUpdateCommand cmd) {
        MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new LocationNotFoundException(mapKey));

        if (location.getLocationType() != LocationType.INSTALACION) {
            throw new LocationTypeMismatchException(
                    mapKey, LocationType.INSTALACION, location.getLocationType());
        }

        Instalacion instalacion = instalacionRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new LocationNotFoundException(mapKey));

        // Update shared display fields on MapLocation
        location.setDisplayName(cmd.displayName());
        location.setDescription(cmd.description());

        // Update installation-specific metadata
        instalacion.setUseDescription(cmd.useDescription());
        instalacion.setAcademicPrograms(cmd.academicPrograms());
        instalacion.setFloorCount(cmd.floorCount());
        if (cmd.operationalStatus() != null) {
            instalacion.setOperationalStatus(cmd.operationalStatus());
        }

        mapLocationRepository.save(location);
        instalacionRepository.save(instalacion);
    }
}
