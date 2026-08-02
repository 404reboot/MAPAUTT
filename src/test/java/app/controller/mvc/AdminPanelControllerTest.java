package app.controller.mvc;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import app.model.AreaVerde;
import app.model.FacilityType;
import app.model.Instalacion;
import app.model.LocationType;
import app.model.MapLocation;
import app.model.OperationalStatus;
import app.repository.AreaVerdeRepository;
import app.repository.InstalacionRepository;
import app.repository.MapLocationRepository;
import app.service.AreaVerdeService;
import app.service.InstalacionService;
import app.service.MapLocationQueryService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

/**
 * Web MVC tests for {@link AdminPanelController}.
 * Verifies form binding, validation errors, redirects, and error handling.
 */
@WebMvcTest(AdminPanelController.class)
class AdminPanelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InstalacionService instalacionService;

    @MockBean
    private AreaVerdeService areaVerdeService;

    @MockBean
    private MapLocationQueryService mapLocationQueryService;

    @MockBean
    private MapLocationRepository mapLocationRepository;

    @MockBean
    private InstalacionRepository instalacionRepository;

    @MockBean
    private AreaVerdeRepository areaVerdeRepository;

    @Test
    void dashboard_returns200WithCounts() throws Exception {
        when(mapLocationRepository.findAllByLocationTypeAndActiveTrue(LocationType.INSTALACION))
                .thenReturn(List.of(
                        new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D")));
        when(mapLocationRepository.findAllByLocationTypeAndActiveTrue(LocationType.AREA_VERDE))
                .thenReturn(List.of());

        mockMvc.perform(get("/admin-panel"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin_panel"))
                .andExpect(model().attribute("instalacionCount", 1L))
                .andExpect(model().attribute("areaVerdeCount", 0L));
    }

    @Test
    void listInstalaciones_returns200() throws Exception {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(location, FacilityType.BUILDING);
        when(instalacionRepository.findAll()).thenReturn(List.of(inst));

        mockMvc.perform(get("/admin-panel/instalaciones"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/instalaciones"))
                .andExpect(model().attributeExists("instalaciones"));
    }

    @Test
    void listAreasVerdes_returns200() throws Exception {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        AreaVerde av = new AreaVerde(location);
        when(areaVerdeRepository.findAll()).thenReturn(List.of(av));

        mockMvc.perform(get("/admin-panel/areas-verdes"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/areas-verdes"))
                .andExpect(model().attributeExists("areasVerdes"));
    }

    @Test
    void editInstalacionForm_validKey_returns200() throws Exception {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(location, FacilityType.BUILDING);
        inst.setOperationalStatus(OperationalStatus.ACTIVE);

        when(mapLocationRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(location));
        when(instalacionRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(inst));

        mockMvc.perform(get("/admin-panel/instalaciones/edificio-d/edit"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/edit-instalacion"))
                .andExpect(model().attributeExists("location", "instalacion", "command", "operationalStatuses"));
    }

    @Test
    void editInstalacionForm_unknownKey_redirectsWithError() throws Exception {
        when(mapLocationRepository.findByMapKey("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/admin-panel/instalaciones/nonexistent/edit"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin-panel"))
                .andExpect(flash().attributeExists("errorMessage"));
    }

    @Test
    void processEditInstalacion_validData_redirectsWithSuccess() throws Exception {
        mockMvc.perform(post("/admin-panel/instalaciones/edificio-d/edit")
                        .param("displayName", "Edificio D Actualizado")
                        .param("description", "Descripcion nueva")
                        .param("useDescription", "Aulas")
                        .param("academicPrograms", "ISC")
                        .param("floorCount", "3")
                        .param("operationalStatus", "ACTIVE"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin-panel/instalaciones"))
                .andExpect(flash().attribute("successMessage", "Instalacion actualizada correctamente."));

        verify(instalacionService).updateMetadata(eq("edificio-d"), any());
    }

    @Test
    void processEditInstalacion_blankName_returnsFormWithErrors() throws Exception {
        MapLocation location = new MapLocation("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D");
        Instalacion inst = new Instalacion(location, FacilityType.BUILDING);

        when(mapLocationRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(location));
        when(instalacionRepository.findByMapKey("edificio-d")).thenReturn(Optional.of(inst));

        mockMvc.perform(post("/admin-panel/instalaciones/edificio-d/edit")
                        .param("displayName", "")
                        .param("operationalStatus", "ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/edit-instalacion"))
                .andExpect(model().hasErrors());
    }

    @Test
    void editAreaVerdeForm_validKey_returns200() throws Exception {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        AreaVerde av = new AreaVerde(location);

        when(mapLocationRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(location));
        when(areaVerdeRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(av));

        mockMvc.perform(get("/admin-panel/areas-verdes/zona-verde-sur/edit"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/edit-area-verde"))
                .andExpect(model().attributeExists("location", "areaVerde", "command"));
    }

    @Test
    void editAreaVerdeForm_unknownKey_redirectsWithError() throws Exception {
        when(mapLocationRepository.findByMapKey("nonexistent")).thenReturn(Optional.empty());

        mockMvc.perform(get("/admin-panel/areas-verdes/nonexistent/edit"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin-panel"))
                .andExpect(flash().attributeExists("errorMessage"));
    }

    @Test
    void processEditAreaVerde_validData_redirectsWithSuccess() throws Exception {
        mockMvc.perform(post("/admin-panel/areas-verdes/zona-verde-sur/edit")
                        .param("displayName", "Zona Verde Sur Actualizada")
                        .param("description", "Descripcion")
                        .param("sector", "Sur")
                        .param("surfaceArea", "500.00"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin-panel/areas-verdes"))
                .andExpect(flash().attribute("successMessage", "Area verde actualizada correctamente."));

        verify(areaVerdeService).updateMetadata(eq("zona-verde-sur"), any());
    }

    @Test
    void processEditAreaVerde_blankName_returnsFormWithErrors() throws Exception {
        MapLocation location = new MapLocation("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur");
        AreaVerde av = new AreaVerde(location);

        when(mapLocationRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(location));
        when(areaVerdeRepository.findByMapKey("zona-verde-sur")).thenReturn(Optional.of(av));

        mockMvc.perform(post("/admin-panel/areas-verdes/zona-verde-sur/edit")
                        .param("displayName", "")
                        .param("sector", "Sur"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/edit-area-verde"))
                .andExpect(model().hasErrors());
    }
}
