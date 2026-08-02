package app.exception;

/**
 * Thrown when a map location cannot be found by its map key.
 */
public class LocationNotFoundException extends RuntimeException {

    private final String mapKey;

    public LocationNotFoundException(String mapKey) {
        super("Location not found: " + mapKey);
        this.mapKey = mapKey;
    }

    public String getMapKey() {
        return mapKey;
    }
}
