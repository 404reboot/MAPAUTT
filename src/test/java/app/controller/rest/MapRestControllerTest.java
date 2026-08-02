package app.controller.rest;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import app.dto.LocationDetailDto;
import app.dto.LocationSummaryDto;
import app.model.LocationType;
import app.service.MapLocationQueryService;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Web layer tests for {@link MapRestController}.
 */
@WebMvcTest(MapRestController.class)
class MapRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MapLocationQueryService queryService;

    @Test
    void getInventory_returns200() throws Exception {
        List<LocationSummaryDto> inventory = List.of(
                new LocationSummaryDto("edificio-d", "Edificio D.", LocationType.INSTALACION, "Edificio D"),
                new LocationSummaryDto("zona-verde-sur", "Zona Verde Sur", LocationType.AREA_VERDE, "Zona Verde Sur")
        );

        when(queryService.getInventory()).thenReturn(inventory);

        mockMvc.perform(get("/api/map/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].mapKey", is("edificio-d")))
                .andExpect(jsonPath("$[0].glbObjectName", is("Edificio D.")))
                .andExpect(jsonPath("$[0].locationType", is("INSTALACION")))
                .andExpect(jsonPath("$[0].displayName", is("Edificio D")))
                .andExpect(jsonPath("$[1].mapKey", is("zona-verde-sur")))
                .andExpect(jsonPath("$[1].locationType", is("AREA_VERDE")));
    }

    @Test
    void getDetail_found_returns200() throws Exception {
        LocationDetailDto detail = new LocationDetailDto(
                "edificio-d",
                LocationType.INSTALACION,
                "Edificio D",
                "Edificio principal",
                null
        );

        when(queryService.getDetail("edificio-d")).thenReturn(Optional.of(detail));

        mockMvc.perform(get("/api/map/locations/edificio-d"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mapKey", is("edificio-d")))
                .andExpect(jsonPath("$.locationType", is("INSTALACION")))
                .andExpect(jsonPath("$.displayName", is("Edificio D")))
                .andExpect(jsonPath("$.description", is("Edificio principal")));
    }

    @Test
    void getDetail_notFound_returns404() throws Exception {
        when(queryService.getDetail("unknown-key")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/map/locations/unknown-key"))
                .andExpect(status().isNotFound());
    }
}
