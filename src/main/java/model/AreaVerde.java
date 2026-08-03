package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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

    public AreaVerde() {
    }

    public AreaVerde(int id, String nombre, String sector, Double superficie, String descripcion, String codigoMesh) {
        this.id = id;
        this.nombre = nombre;
        this.sector = sector;
        this.superficie = superficie;
        this.descripcion = descripcion;
        this.codigoMesh = codigoMesh;
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
}
