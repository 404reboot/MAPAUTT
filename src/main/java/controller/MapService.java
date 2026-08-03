package controller;

import model.AreaVerde;
import model.AreaVerdeRepository;
import model.Edificio;
import model.EdificioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapService {

    private final EdificioRepository edificioRepository;
    private final AreaVerdeRepository areaVerdeRepository;

    @Autowired
    public MapService(EdificioRepository edificioRepository, AreaVerdeRepository areaVerdeRepository) {
        this.edificioRepository = edificioRepository;
        this.areaVerdeRepository = areaVerdeRepository;
    }

    public List<Edificio> getEdificios() {
        return edificioRepository.findAll();
    }

    public List<AreaVerde> getAreasVerdes() {
        return areaVerdeRepository.findAll();
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

    public void updateEdificio(Edificio updated) {
        edificioRepository.save(updated);
    }

    public void updateAreaVerde(AreaVerde updated) {
        areaVerdeRepository.save(updated);
    }

    public void deleteEdificio(Integer id) {
        if (id != null) {
            edificioRepository.deleteById(id);
        }
    }

    public void deleteAreaVerde(int id) {
        areaVerdeRepository.deleteById(id);
    }
}
