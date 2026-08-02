package app.exception;

import app.model.LocationType;

/**
 * Thrown when an operation targets a location whose type does not match
 * the expected type (e.g., attempting an installation update on a green area).
 */
public class LocationTypeMismatchException extends RuntimeException {

    private final String mapKey;
    private final LocationType expected;
    private final LocationType actual;

    public LocationTypeMismatchException(String mapKey, LocationType expected, LocationType actual) {
        super("Location '%s' has type %s but expected %s".formatted(mapKey, actual, expected));
        this.mapKey = mapKey;
        this.expected = expected;
        this.actual = actual;
    }

    public String getMapKey() {
        return mapKey;
    }

    public LocationType getExpected() {
        return expected;
    }

    public LocationType getActual() {
        return actual;
    }
}
