package app;

import controller.MapService;
import model.AreaVerde;
import model.Edificio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(classes = Main.class)
public class MapServiceFallbackTest {

    @Autowired
    private MapService mapService;

    @Test
    public void testEdificioExactMatch() {
        // "Edificio_E" exists exactly in DB
        Edificio e = mapService.getEdificioByCodigoMesh("Edificio_E");
        assertNotNull(e, "Should find exact match for Edificio_E");
        assertEquals("Edificio_E", e.getCodigoMesh());
    }

    @Test
    public void testEdificioFallbackWithNumberSuffix() {
        // "Edificio_H_1" doesn't exist, but "Edificio_H" does.
        Edificio h = mapService.getEdificioByCodigoMesh("Edificio_H_1");
        assertNotNull(h, "Should strip _1 and find Edificio_H");
        assertEquals("Edificio_H", h.getCodigoMesh());
    }

    @Test
    public void testAreaVerdeFallbackWithUnderscoreSuffix() {
        // "Zona_Verde_Con_Fuente_" doesn't exist, but "Zona_Verde_Con_Fuente" does.
        AreaVerde a = mapService.getAreaVerdeByCodigoMesh("Zona_Verde_Con_Fuente_");
        assertNotNull(a, "Should strip trailing underscore and find Zona_Verde_Con_Fuente");
        assertEquals("Zona_Verde_Con_Fuente", a.getCodigoMesh());
    }
}
