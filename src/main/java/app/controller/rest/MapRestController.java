package app.controller.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.dto.LocationDetailDto;
import app.dto.LocationSummaryDto;
import app.exception.LocationNotFoundException;
import app.service.MapLocationQueryService;

/**
 * Public REST API for the campus map. Exposes read-only endpoints for
 * listing and viewing location details.
 */
@RestController
@RequestMapping("/api/map")
public class MapRestController {

    private final MapLocationQueryService queryService;

    public MapRestController(MapLocationQueryService queryService) {
        this.queryService = queryService;
    }

    /**
     * Returns a lightweight summary of all active map locations.
     */
    @GetMapping("/locations")
    public List<LocationSummaryDto> getLocations() {
        return queryService.getInventory();
    }

    /**
     * Returns the full detail of a single location including type-specific metadata.
     *
     * @param mapKey the stable application key identifying the location
     * @throws LocationNotFoundException if no active location has the given key
     */
    @GetMapping("/locations/{mapKey}")
    public LocationDetailDto getLocationDetail(@PathVariable String mapKey) {
        return queryService.getDetail(mapKey)
                .orElseThrow(() -> new LocationNotFoundException(mapKey));
    }
}
