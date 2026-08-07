package model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;

@Entity
@Table(name = "animal")
public class Animal {
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String reino; 
    private String clase;
    private String subclase; 
    private String orden;
    private String familia;
    private String subfamilia;
    private String genero;
    private String especie;
    private String assetId; // Imagen 

    public Animal(){
    }

    public Animal(Integer id,String nombre, String reino, String clase, String subclase, String orden, String familia,
            String subfamilia, String genero, String especie, String assetId) {
        this.id = id;
        this.nombre=nombre;
        this.reino = reino;
        this.clase = clase;
        this.subclase = subclase;
        this.orden = orden;
        this.familia = familia;
        this.subfamilia = subfamilia;
        this.genero = genero;
        this.especie = especie;
        this.assetId = assetId; // Imagen
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    

    public String getReino() {
        return reino;
    }

    public void setReino(String reino) {
        this.reino = reino;
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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }


}
