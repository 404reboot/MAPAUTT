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
            new Edificio(1, "E", "Alimentos", 1, "Activo"),
            new Edificio(2, "F", "Administración", 2, "Activo"),
            new Edificio(3, "R", "Mecatrónica", 2, "En Mantenimiento"),
            new Edificio(4, "M", "Agricultura", 1, "Activo"),
            new Edificio(5, "K", "Tecnologías de la Información", 1, "Activo"),
            new Edificio(6, "H", "Contaduría", 2, "Activo")
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

    public void addEdificio(Edificio edificio) {
        int nextId = edificios.stream()
                .mapToInt(Edificio::getId)
                .max()
                .orElse(0) + 1;
        edificio.setId(nextId);
        edificios.add(edificio);
    }

    public void addAreaVerde(AreaVerde areaVerde) {
        int nextId = areasVerdes.stream()
                .mapToInt(AreaVerde::getId)
                .max()
                .orElse(0) + 1;
        areaVerde.setId(nextId);
        areasVerdes.add(areaVerde);
    }

    public void updateEdificio(Edificio updated) {
        for (int i = 0; i < edificios.size(); i++) {
            if (edificios.get(i).getId().equals(updated.getId())) {
                edificios.set(i, updated);
                return;
            }
        }
    }

    public void updateAreaVerde(AreaVerde updated) {
        for (int i = 0; i < areasVerdes.size(); i++) {
            if (areasVerdes.get(i).getId() == updated.getId()) {
                areasVerdes.set(i, updated);
                return;
            }
        }
    }

    public void deleteEdificio(Integer id) {
        edificios.removeIf(e -> e.getId().equals(id));
    }

    public void deleteAreaVerde(int id) {
        areasVerdes.removeIf(a -> a.getId() == id);
    }
}
