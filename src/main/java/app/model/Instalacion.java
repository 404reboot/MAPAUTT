package app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Detail table for installation-type locations (buildings, parking, sports
 * facilities, service points, paths, and other non-green infrastructure).
 * Shares its primary key with {@link MapLocation} via {@code @MapsId}.
 */
@Entity
@Table(name = "instalacion")
public class Instalacion {

    @Id
    @Column(name = "location_id")
    private Long locationId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "location_id")
    private MapLocation mapLocation;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "facility_type", nullable = false, length = 30)
    private FacilityType facilityType;

    @Size(max = 500)
    @Column(name = "use_description", length = 500)
    private String useDescription;

    @Column(name = "academic_programs", columnDefinition = "TEXT")
    private String academicPrograms;

    @Min(1)
    @Column(name = "floor_count")
    private Integer floorCount;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "operational_status", nullable = false, length = 30)
    private OperationalStatus operationalStatus = OperationalStatus.ACTIVE;

    protected Instalacion() {
        // JPA requires a no-arg constructor
    }

    public Instalacion(MapLocation mapLocation, FacilityType facilityType) {
        this.mapLocation = mapLocation;
        this.facilityType = facilityType;
        this.operationalStatus = OperationalStatus.ACTIVE;
    }

    public Long getLocationId() {
        return locationId;
    }

    public MapLocation getMapLocation() {
        return mapLocation;
    }

    public FacilityType getFacilityType() {
        return facilityType;
    }

    public String getUseDescription() {
        return useDescription;
    }

    public void setUseDescription(String useDescription) {
        this.useDescription = useDescription;
    }

    public String getAcademicPrograms() {
        return academicPrograms;
    }

    public void setAcademicPrograms(String academicPrograms) {
        this.academicPrograms = academicPrograms;
    }

    public Integer getFloorCount() {
        return floorCount;
    }

    public void setFloorCount(Integer floorCount) {
        this.floorCount = floorCount;
    }

    public OperationalStatus getOperationalStatus() {
        return operationalStatus;
    }

    public void setOperationalStatus(OperationalStatus operationalStatus) {
        this.operationalStatus = operationalStatus;
    }
}
