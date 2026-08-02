package app.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

/**
 * Detail table for green-area locations. Shares its primary key with
 * {@link MapLocation} via {@code @MapsId}.
 */
@Entity
@Table(name = "area_verde")
public class AreaVerde {

    @Id
    @Column(name = "location_id")
    private Long locationId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "location_id")
    private MapLocation mapLocation;

    @Size(max = 100)
    @Column(name = "sector", length = 100)
    private String sector;

    @DecimalMin(value = "0", inclusive = true)
    @Column(name = "surface_area", precision = 12, scale = 2)
    private BigDecimal surfaceArea;

    protected AreaVerde() {
        // JPA requires a no-arg constructor
    }

    public AreaVerde(MapLocation mapLocation) {
        this.mapLocation = mapLocation;
    }

    public Long getLocationId() {
        return locationId;
    }

    public MapLocation getMapLocation() {
        return mapLocation;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public BigDecimal getSurfaceArea() {
        return surfaceArea;
    }

    public void setSurfaceArea(BigDecimal surfaceArea) {
        this.surfaceArea = surfaceArea;
    }
}
