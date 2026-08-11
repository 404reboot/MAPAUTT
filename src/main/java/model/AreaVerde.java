package model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "area_verde")
public class AreaVerde {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String sector;
    private Double superficie;
    private String descripcion;
    private String codigoMesh;
    private String assetId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "area_verde_especie",
        joinColumns = @JoinColumn(name = "area_verde_id"),
        inverseJoinColumns = @JoinColumn(name = "especie_id")
    )
    private Set<Especie> especies = new HashSet<>();

    public AreaVerde() {
    }

    public AreaVerde(int id, String nombre, String sector, Double superficie, String descripcion, String codigoMesh) {
        this(id, nombre, sector, superficie, descripcion, codigoMesh, null);
    }

    public AreaVerde(int id, String nombre, String sector, Double superficie, String descripcion, String codigoMesh, String assetId) {
        this.id = id;
        this.nombre = nombre;
        this.sector = sector;
        this.superficie = superficie;
        this.descripcion = descripcion;
        this.codigoMesh = codigoMesh;
        this.assetId = assetId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public Double getSuperficie() {
        return superficie;
    }

    public void setSuperficie(Double superficie) {
        this.superficie = superficie;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCodigoMesh() {
        return codigoMesh;
    }

    public void setCodigoMesh(String codigoMesh) {
        this.codigoMesh = codigoMesh;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public Set<Especie> getEspecies() {
        return especies;
    }

    public void setEspecies(Set<Especie> especies) {
        this.especies = especies;
    }
}
