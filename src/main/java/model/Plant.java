package model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plant")
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String reino;
    private String division;
    private String clase;
    private String orden;
    private String familia;
    private String genero;
    private String especie;

public Plant(){
}


public Plant(Integer id, String nombre, String reino, String division, String clase, String orden, String familia,
        String genero, String especie) {
    this.id = id;
    this.nombre = nombre;
    this.reino = reino;
    this.division = division;
    this.clase = clase;
    this.orden = orden;
    this.familia = familia;
    this.genero = genero;
    this.especie = especie;
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

public String getDivision() {
    return division;
}

public void setDivision(String division) {
    this.division = division;
}

public String getClase() {
    return clase;
}

public void setClase(String clase) {
    this.clase = clase;
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



} 

