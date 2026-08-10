package controller;

import model.AreaVerde;
import model.AreaVerdeRepository;
import model.Edificio;
import model.EdificioRepository;
import model.Especie;
import model.EspecieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MapService {

    private final EdificioRepository edificioRepository;
    private final AreaVerdeRepository areaVerdeRepository;
    private final EspecieRepository especieRepository;

    @Autowired
    public MapService(EdificioRepository edificioRepository,
                      AreaVerdeRepository areaVerdeRepository,
                      EspecieRepository especieRepository) {
        this.edificioRepository = edificioRepository;
        this.areaVerdeRepository = areaVerdeRepository;
        this.especieRepository = especieRepository;
    }

    public List<Edificio> getEdificios() {
        return edificioRepository.findAll();
    }

    public List<AreaVerde> getAreasVerdes() {
        return areaVerdeRepository.findAll();
    }

    public List<Especie> getEspecies() {
        return especieRepository.findAll();
    }

    public List<Especie> getEspeciesByReino(String reino) {
        return especieRepository.findByReinoIgnoreCase(reino);
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

    public void addEspecie(Especie especie) {
        especieRepository.save(especie);
    }

    public void addEspecieToAreaVerde(int areaVerdeId, int especieId) {
        AreaVerde area = areaVerdeRepository.findById(areaVerdeId).orElse(null);
        Especie especie = especieRepository.findById(especieId).orElse(null);
        if (area != null && especie != null) {
            area.getEspecies().add(especie);
            areaVerdeRepository.save(area);
        }
    }

    public void removeEspecieFromAreaVerde(int areaVerdeId, int especieId) {
        AreaVerde area = areaVerdeRepository.findById(areaVerdeId).orElse(null);
        if (area != null) {
            area.getEspecies().removeIf(e -> e.getId().equals(especieId));
            areaVerdeRepository.save(area);
        }
    }

    public void updateEdificio(Edificio updated) {
        edificioRepository.save(updated);
    }

    public void updateAreaVerde(AreaVerde updated) {
        areaVerdeRepository.save(updated);
    }

    public void updateEspecie(Especie updated) {
        especieRepository.save(updated);
    }

    public void deleteEdificio(Integer id) {
        if (id != null) {
            edificioRepository.deleteById(id);
        }
    }

    public void deleteAreaVerde(int id) {
        areaVerdeRepository.deleteById(id);
    }

    public void deleteEspecie(Integer id) {
        if (id != null) {
            especieRepository.deleteById(id);
        }
    }
}
