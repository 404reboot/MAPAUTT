package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "especies")
public class Especie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String reino;
    private String divisionPhylum;
    private String clase;
    private String subclase;
    private String orden;
    private String familia;
    private String subfamilia;
    private String genero;
    private String especie;
    private String variedad;
    private String assetId;
    private String observaciones;

    public Especie() {
    }

    public Especie(Integer id, String nombre, String reino, String divisionPhylum, String clase, String subclase,
                   String orden, String familia, String subfamilia, String genero, String especie, String variedad,
                   String assetId, String observaciones) {
        this.id = id;
        this.nombre = nombre;
        this.reino = reino;
        this.divisionPhylum = divisionPhylum;
        this.clase = clase;
        this.subclase = subclase;
        this.orden = orden;
        this.familia = familia;
        this.subfamilia = subfamilia;
        this.genero = genero;
        this.especie = especie;
        this.variedad = variedad;
        this.assetId = assetId;
        this.observaciones = observaciones;
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

    public String getReino() {
        return reino;
    }

    public void setReino(String reino) {
        this.reino = reino;
    }

    public String getDivisionPhylum() {
        return divisionPhylum;
    }

    public void setDivisionPhylum(String divisionPhylum) {
        this.divisionPhylum = divisionPhylum;
    }

    public String getClase() {
        return clase;
    }

    public void setClase(String clase) {
        this.clase = clase;
    }

    public String getSubclase() {
        return subclase;
    }

    public void setSubclase(String subclase) {
        this.subclase = subclase;
    }

    public String getOrden() {
        return orden;
    }

    public void setOrden(String orden) {
        this.orden = orden;
    }

    public String getFamilia() {
        return familia;
    }

    public void setFamilia(String familia) {
        this.familia = familia;
    }

    public String getSubfamilia() {
        return subfamilia;
    }

    public void setSubfamilia(String subfamilia) {
        this.subfamilia = subfamilia;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getVariedad() {
        return variedad;
    }

    public void setVariedad(String variedad) {
        this.variedad = variedad;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
