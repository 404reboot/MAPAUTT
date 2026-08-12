package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "edificio")
public class Edificio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String carreras;
    private String codigoMesh;
    private String assetId;

    public Edificio() {
    }

    public Edificio(Integer id, String nombre, String carreras, String codigoMesh) {
        this(id, nombre, carreras, codigoMesh, null);
    }

    public Edificio(Integer id, String nombre, String carreras, String codigoMesh, String assetId) {
        this.id = id;
        this.nombre = nombre;
        this.carreras = carreras;
        this.codigoMesh = codigoMesh;
        this.assetId = assetId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCarreras() {
        return carreras;
    }

    public void setCarreras(String carreras) {
        this.carreras = carreras;
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
}
