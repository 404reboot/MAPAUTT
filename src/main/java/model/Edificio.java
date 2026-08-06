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
    private Integer pisos;
    private String estado;
    private String codigoMesh;

    public Edificio() {
    }

    public Edificio(Integer id, String nombre, String carreras, Integer pisos, String estado, String codigoMesh) {
        this.id = id;
        this.nombre = nombre;
        this.carreras = carreras;
        this.pisos = pisos;
        this.estado = estado;
        this.codigoMesh = codigoMesh;
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

    public void setCarreras(String codigo) {
        this.carreras = codigo;
    }

    public Integer getPisos() {
        return pisos;
    }

    public void setPisos(Integer pisos) {
        this.pisos = pisos;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCodigoMesh() {
        return codigoMesh;
    }

    public void setCodigoMesh(String codigoMesh) {
        this.codigoMesh = codigoMesh;
    }
}
