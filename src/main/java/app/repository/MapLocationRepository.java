package app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.model.LocationType;
import app.model.MapLocation;

/**
 * Repository for the shared map-location identity table.
 */
@Repository
public interface MapLocationRepository extends JpaRepository<MapLocation, Long> {

    Optional<MapLocation> findByMapKey(String mapKey);

    Optional<MapLocation> findByGlbObjectName(String glbObjectName);

    boolean existsByMapKey(String mapKey);

    boolean existsByGlbObjectName(String glbObjectName);

    List<MapLocation> findAllByActiveTrue();

    List<MapLocation> findAllByLocationTypeAndActiveTrue(LocationType locationType);
}
