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
    private double xCord;
    private double yCord;

    public AreaVerde() {
    }

    public AreaVerde(int id, String nombre, String sector, Double superficie, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.sector = sector;
        this.superficie = superficie;
        this.descripcion = descripcion;
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

    public void setDescripcion(String tipoRiego) {
        this.descripcion = tipoRiego;
    }

	public double getxCord() {
		return xCord;
	}

	public void setxCord(double xCord) {
		this.xCord = xCord;
	}

	public double getyCord() {
		return yCord;
	}

	public void setyCord(double yCord) {
		this.yCord = yCord;
	}

    
}
