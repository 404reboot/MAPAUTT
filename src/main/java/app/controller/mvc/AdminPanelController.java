package app.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import app.dto.AreaVerdeUpdateCommand;
import app.dto.InstalacionUpdateCommand;
import app.model.AreaVerde;
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
import jakarta.validation.Valid;

/**
 * MVC controller for the administrative panel. Provides edit-only operations
 * on installations and green areas. No add or delete routes are exposed.
 */
@Controller
@RequestMapping("/admin-panel")
public class AdminPanelController {

    private final InstalacionService instalacionService;
    private final AreaVerdeService areaVerdeService;
    private final MapLocationQueryService mapLocationQueryService;
    private final MapLocationRepository mapLocationRepository;
    private final InstalacionRepository instalacionRepository;
    private final AreaVerdeRepository areaVerdeRepository;

    public AdminPanelController(InstalacionService instalacionService,
                                AreaVerdeService areaVerdeService,
                                MapLocationQueryService mapLocationQueryService,
                                MapLocationRepository mapLocationRepository,
                                InstalacionRepository instalacionRepository,
                                AreaVerdeRepository areaVerdeRepository) {
        this.instalacionService = instalacionService;
        this.areaVerdeService = areaVerdeService;
        this.mapLocationQueryService = mapLocationQueryService;
        this.mapLocationRepository = mapLocationRepository;
        this.instalacionRepository = instalacionRepository;
        this.areaVerdeRepository = areaVerdeRepository;
    }

    /**
     * Dashboard view showing summary counts.
     */
    @GetMapping
    public String dashboard(Model model) {
        long instalacionCount = mapLocationRepository
                .findAllByLocationTypeAndActiveTrue(LocationType.INSTALACION).size();
        long areaVerdeCount = mapLocationRepository
                .findAllByLocationTypeAndActiveTrue(LocationType.AREA_VERDE).size();

        model.addAttribute("instalacionCount", instalacionCount);
        model.addAttribute("areaVerdeCount", areaVerdeCount);
        return "admin_panel";
    }

    /**
     * Lists all installations.
     */
    @GetMapping("/instalaciones")
    public String listInstalaciones(Model model) {
        var instalaciones = instalacionRepository.findAll();
        model.addAttribute("instalaciones", instalaciones);
        return "admin/instalaciones";
    }

    /**
     * Lists all green areas.
     */
    @GetMapping("/areas-verdes")
    public String listAreasVerdes(Model model) {
        var areasVerdes = areaVerdeRepository.findAll();
        model.addAttribute("areasVerdes", areasVerdes);
        return "admin/areas-verdes";
    }

    /**
     * Shows the edit form for an installation, pre-filled with current values.
     */
    @GetMapping("/instalaciones/{mapKey}/edit")
    public String editInstalacionForm(@PathVariable String mapKey, Model model) {
        MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new IllegalArgumentException("Location not found: " + mapKey));
        Instalacion instalacion = instalacionRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new IllegalArgumentException("Instalacion detail not found: " + mapKey));

        model.addAttribute("location", location);
        model.addAttribute("instalacion", instalacion);
        model.addAttribute("operationalStatuses", OperationalStatus.values());

        if (!model.containsAttribute("command")) {
            InstalacionUpdateCommand command = new InstalacionUpdateCommand(
                    location.getDisplayName(),
                    location.getDescription(),
                    instalacion.getUseDescription(),
                    instalacion.getAcademicPrograms(),
                    instalacion.getFloorCount(),
                    instalacion.getOperationalStatus()
            );
            model.addAttribute("command", command);
        }

        return "admin/edit-instalacion";
    }

    /**
     * Processes the edit form for an installation.
     */
    @PostMapping("/instalaciones/{mapKey}/edit")
    public String processEditInstalacion(@PathVariable String mapKey,
                                         @Valid @ModelAttribute("command") InstalacionUpdateCommand command,
                                         BindingResult bindingResult,
                                         Model model,
                                         RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                    .orElseThrow(() -> new IllegalArgumentException("Location not found: " + mapKey));
            Instalacion instalacion = instalacionRepository.findByMapKey(mapKey)
                    .orElseThrow(() -> new IllegalArgumentException("Instalacion detail not found: " + mapKey));

            model.addAttribute("location", location);
            model.addAttribute("instalacion", instalacion);
            model.addAttribute("operationalStatuses", OperationalStatus.values());
            return "admin/edit-instalacion";
        }

        instalacionService.updateMetadata(mapKey, command);
        redirectAttributes.addFlashAttribute("successMessage", "Instalacion actualizada correctamente.");
        return "redirect:/admin-panel/instalaciones";
    }

    /**
     * Shows the edit form for a green area, pre-filled with current values.
     */
    @GetMapping("/areas-verdes/{mapKey}/edit")
    public String editAreaVerdeForm(@PathVariable String mapKey, Model model) {
        MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new IllegalArgumentException("Location not found: " + mapKey));
        AreaVerde areaVerde = areaVerdeRepository.findByMapKey(mapKey)
                .orElseThrow(() -> new IllegalArgumentException("AreaVerde detail not found: " + mapKey));

        model.addAttribute("location", location);
        model.addAttribute("areaVerde", areaVerde);

        if (!model.containsAttribute("command")) {
            AreaVerdeUpdateCommand command = new AreaVerdeUpdateCommand(
                    location.getDisplayName(),
                    location.getDescription(),
                    areaVerde.getSector(),
                    areaVerde.getSurfaceArea()
            );
            model.addAttribute("command", command);
        }

        return "admin/edit-area-verde";
    }

    /**
     * Processes the edit form for a green area.
     */
    @PostMapping("/areas-verdes/{mapKey}/edit")
    public String processEditAreaVerde(@PathVariable String mapKey,
                                       @Valid @ModelAttribute("command") AreaVerdeUpdateCommand command,
                                       BindingResult bindingResult,
                                       Model model,
                                       RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            MapLocation location = mapLocationRepository.findByMapKey(mapKey)
                    .orElseThrow(() -> new IllegalArgumentException("Location not found: " + mapKey));
            AreaVerde areaVerde = areaVerdeRepository.findByMapKey(mapKey)
                    .orElseThrow(() -> new IllegalArgumentException("AreaVerde detail not found: " + mapKey));

            model.addAttribute("location", location);
            model.addAttribute("areaVerde", areaVerde);
            return "admin/edit-area-verde";
        }

        areaVerdeService.updateMetadata(mapKey, command);
        redirectAttributes.addFlashAttribute("successMessage", "Area verde actualizada correctamente.");
        return "redirect:/admin-panel/areas-verdes";
    }
}
