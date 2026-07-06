package model;

public class AreaVerde {
    private Long id;
    private String nombre;
    private String sector;
    private Double superficie;
    private String tipoRiego;
    private String ultimoMantenimiento;

    public AreaVerde() {
    }

    public AreaVerde(Long id, String nombre, String sector, Double superficie, String tipoRiego, String ultimoMantenimiento) {
        this.id = id;
        this.nombre = nombre;
        this.sector = sector;
        this.superficie = superficie;
        this.tipoRiego = tipoRiego;
        this.ultimoMantenimiento = ultimoMantenimiento;
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

    public String getTipoRiego() {
        return tipoRiego;
    }

    public void setTipoRiego(String tipoRiego) {
        this.tipoRiego = tipoRiego;
    }

    public String getUltimoMantenimiento() {
        return ultimoMantenimiento;
    }

    public void setUltimoMantenimiento(String ultimoMantenimiento) {
        this.ultimoMantenimiento = ultimoMantenimiento;
    }
}
