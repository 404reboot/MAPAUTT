package model;

public class Edificio {
    private Long id;
    private String nombre;
    private String carreras;
    private Integer pisos;
    private String estado;

    public Edificio() {
    }

    public Edificio(Long id, String nombre, String carreras, Integer pisos, String estado) {
        this.id = id;
        this.nombre = nombre;
        this.carreras = carreras;
        this.pisos = pisos;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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
}
