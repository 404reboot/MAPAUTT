package app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Shared identity table for all interactive campus map locations.
 * Each record corresponds to exactly one scene-root wrapper node in the GLB model.
 */
@Entity
@Table(name = "map_location", uniqueConstraints = {
    @UniqueConstraint(name = "uk_map_location_map_key", columnNames = "map_key"),
    @UniqueConstraint(name = "uk_map_location_glb_object_name", columnNames = "glb_object_name")
})
public class MapLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "mapKey must be a lowercase hyphenated slug")
    @Column(name = "map_key", nullable = false, length = 100, unique = true)
    private String mapKey;

    @NotBlank
    @Size(max = 255)
    @Column(name = "glb_object_name", nullable = false, length = 255, unique = true)
    private String glbObjectName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "location_type", nullable = false, length = 30)
    private LocationType locationType;

    @NotBlank
    @Size(max = 150)
    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Version
    @Column(name = "version")
    private Long version;

    protected MapLocation() {
        // JPA requires a no-arg constructor
    }

    public MapLocation(String mapKey, String glbObjectName, LocationType locationType, String displayName) {
        this.mapKey = mapKey;
        this.glbObjectName = glbObjectName;
        this.locationType = locationType;
        this.displayName = displayName;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getMapKey() {
        return mapKey;
    }

    public String getGlbObjectName() {
        return glbObjectName;
    }

    public LocationType getLocationType() {
        return locationType;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return active;
    }

    public Long getVersion() {
        return version;
    }
}
