package controller;

import model.Animal;
import model.AnimalRepository;
import model.AreaVerde;
import model.AreaVerdeRepository;
import model.Edificio;
import model.EdificioRepository;
import model.Plant;
import model.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapService {

    private final EdificioRepository edificioRepository;
    private final AreaVerdeRepository areaVerdeRepository;
    private final AnimalRepository animalRepository;
    private final PlantRepository plantRepository;

    @Autowired
    public MapService(EdificioRepository edificioRepository,
                      AreaVerdeRepository areaVerdeRepository,
                      AnimalRepository animalRepository,
                      PlantRepository plantRepository) {
        this.edificioRepository = edificioRepository;
        this.areaVerdeRepository = areaVerdeRepository;
        this.animalRepository = animalRepository;
        this.plantRepository = plantRepository;
    }

    public List<Edificio> getEdificios() {
        return edificioRepository.findAll();
    }

    public List<AreaVerde> getAreasVerdes() {
        return areaVerdeRepository.findAll();
    }

    public List<Animal> getAnimales() {
        return animalRepository.findAll();
    }

    public List<Plant> getPlantas() {
        return plantRepository.findAll();
    }

    public Edificio getEdificioByCodigoMesh(String codigoMesh) {
        if (codigoMesh == null || codigoMesh.trim().isEmpty()) {
            return null;
        }
        List<Edificio> results = edificioRepository.findByCodigoMeshIgnoreCase(codigoMesh);
        if (!results.isEmpty()) {
            return results.get(0);
        }
        
        String stripped = codigoMesh.replaceAll("_[0-9]+$", "").replaceAll("_+$", "");
        if (!stripped.equals(codigoMesh)) {
            List<Edificio> fallback = edificioRepository.findByCodigoMeshIgnoreCase(stripped);
            if (!fallback.isEmpty()) {
                return fallback.get(0);
            }
        }
        return null;
    }

    public AreaVerde getAreaVerdeById(int id) {
        return areaVerdeRepository.findById(id).orElse(null);
    }

    public AreaVerde getAreaVerdeByCodigoMesh(String codigoMesh) {
        if (codigoMesh == null || codigoMesh.trim().isEmpty()) {
            return null;
        }
        List<AreaVerde> results = areaVerdeRepository.findByCodigoMeshIgnoreCase(codigoMesh);
        if (!results.isEmpty()) {
            return results.get(0);
        }
        
        String stripped = codigoMesh.replaceAll("_[0-9]+$", "").replaceAll("_+$", "");
        if (!stripped.equals(codigoMesh)) {
            List<AreaVerde> fallback = areaVerdeRepository.findByCodigoMeshIgnoreCase(stripped);
            if (!fallback.isEmpty()) {
                return fallback.get(0);
            }
        }
        return null;
    }

    public void addEdificio(Edificio edificio) {
        edificioRepository.save(edificio);
    }

    public void addAreaVerde(AreaVerde areaVerde) {
        areaVerdeRepository.save(areaVerde);
    }

    public void addAnimal(Animal animal) {
        animalRepository.save(animal);
    }

    public void addPlant(Plant plant) {
        plantRepository.save(plant);
    }

    public void updateEdificio(Edificio updated) {
        edificioRepository.save(updated);
    }

    public void updateAreaVerde(AreaVerde updated) {
        areaVerdeRepository.save(updated);
    }

    public void updateAnimal(Animal updated) {
        animalRepository.save(updated);
    }

    public void updatePlant(Plant updated) {
        plantRepository.save(updated);
    }

    public void deleteEdificio(Integer id) {
        if (id != null) {
            edificioRepository.deleteById(id);
        }
    }

    public void deleteAreaVerde(int id) {
        areaVerdeRepository.deleteById(id);
    }

    public void deleteAnimal(Integer id) {
        if (id != null) {
            animalRepository.deleteById(id);
        }
    }

    public void deletePlant(Integer id) {
        if (id != null) {
            plantRepository.deleteById(id);
        }
    }
}

