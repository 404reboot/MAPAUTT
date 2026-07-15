package controller;

import model.AreaVerde;
import model.Edificio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class MapService {
    private final List<Edificio> edificios = new ArrayList<>();
    private final List<AreaVerde> areasVerdes = new ArrayList<>();

    public MapService() {
        // Initialize default mock buildings
        edificios.addAll(Arrays.asList(
            new Edificio(1, "E", "Alimentos", 4, "Activo"),
            new Edificio(2, "F", "Administración", 5, "Activo"),
            new Edificio(3, "T", "Turismo", 2, "En Mantenimiento"),
            new Edificio(4, "R", "Mecatrónica", 2, "En Mantenimiento"),
            new Edificio(5, "M", "Agricultura", 3, "Activo"),
            new Edificio(6, "K", "Tecnologías de la Información", 1, "Activo"),
            new Edificio(7, "H", "Contaduría", 1, "Activo")
        ));

        // Initialize default mock green areas
        areasVerdes.addAll(Arrays.asList(
            new AreaVerde(1, "Jardin Norte", "Zona Norte", 1200.5, "Ubicado frente al edificio H"),
            new AreaVerde(2, "Pasillos verdes", "Zona Sur", 4500.0, "Predomina flora como el Ciprés y arbustos"),
            new AreaVerde(3, "Fuente de agua", "Zona Este", 850.0, "Ubicado a un lado de la cafetería"),
            new AreaVerde(4, "Prados", "Zona Centro", 600.2, "Área recreativa central")
        ));
    }

    public List<Edificio> getEdificios() {
        return edificios;
    }

    public List<AreaVerde> getAreasVerdes() {
        return areasVerdes;
    }

    public Edificio getEdificioByNombre(String nombre) {
        return edificios.stream()
                .filter(e -> e.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElse(null);
    }

    public AreaVerde getAreaVerdeById(int id) {
        return areasVerdes.stream()
                .filter(a -> a.getId() == id)
                .findFirst()
                .orElse(null);
    }
}
