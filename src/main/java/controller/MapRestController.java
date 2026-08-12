package controller;

import model.AreaVerde;
import model.Edificio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MapRestController {

    @Autowired
    private MapService mapService;

    @GetMapping("/map-data")
    public ResponseEntity<Map<String, Object>> getMapData() {
        Map<String, Object> data = new HashMap<>();
        data.put("edificios", mapService.getEdificios());
        data.put("areasVerdes", mapService.getAreasVerdes());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/edificios/{codigoMesh}")
    public ResponseEntity<Edificio> getEdificio(@PathVariable String codigoMesh) {
        Edificio edificio = mapService.getEdificioByCodigoMesh(codigoMesh);
        if (edificio != null) {
            return ResponseEntity.ok(edificio);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/areas-verdes/{identifier}")
    public ResponseEntity<AreaVerde> getAreaVerde(@PathVariable String identifier) {
        AreaVerde areaVerde = null;
        try {
            int id = Integer.parseInt(identifier);
            areaVerde = mapService.getAreaVerdeById(id);
        } catch (NumberFormatException e) {
            areaVerde = mapService.getAreaVerdeByCodigoMesh(identifier);
        }

        if (areaVerde == null) {
            areaVerde = mapService.getAreaVerdeByCodigoMesh(identifier);
        }

        if (areaVerde != null) {
            return ResponseEntity.ok(areaVerde);
        }
        return ResponseEntity.notFound().build();
    }
}

