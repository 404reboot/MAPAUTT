package controller;

import model.AreaVerde;
import model.Edificio;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AdminPanelController {

    @Autowired
    private MapService mapService;

    @GetMapping("/admin-panel")
    public String adminPanel(
            @RequestParam(name = "section", defaultValue = "edificios") String section,
            Model model,
            HttpSession session) {

        // Session validation check
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        // Validation to prevent loading arbitrary strings
        if (!"edificios".equals(section) && !"areas-verdes".equals(section)) {
            section = "edificios";
        }

        model.addAttribute("activeSection", section);

        model.addAttribute("edificios", mapService.getEdificios());
        model.addAttribute("areasVerdes", mapService.getAreasVerdes());

        return "admin_panel";
    }

    @PostMapping("/admin-panel/add-edificio")
    public String addEdificio(
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam("pisos") Integer pisos,
            @RequestParam("estado") String estado,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        Edificio nuevoEdificio = new Edificio(null, nombre, carreras, pisos, estado, codigoMesh);
        mapService.addEdificio(nuevoEdificio);

        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/add-area-verde")
    public String addAreaVerde(
            @RequestParam("nombre") String nombre,
            @RequestParam("sector") String sector,
            @RequestParam("superficie") Double superficie,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        AreaVerde nuevaArea = new AreaVerde(0, nombre, sector, superficie, descripcion, codigoMesh);
        mapService.addAreaVerde(nuevaArea);

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/edit-edificio")
    public String editEdificio(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("carreras") String carreras,
            @RequestParam("pisos") Integer pisos,
            @RequestParam("estado") String estado,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        Edificio updatedEdificio = new Edificio(id, nombre, carreras, pisos, estado, codigoMesh);
        mapService.updateEdificio(updatedEdificio);

        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/edit-area-verde")
    public String editAreaVerde(
            @RequestParam("id") Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("sector") String sector,
            @RequestParam("superficie") Double superficie,
            @RequestParam("descripcion") String descripcion,
            @RequestParam(value = "codigoMesh", required = false) String codigoMesh,
            HttpSession session) {

        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }

        AreaVerde updatedArea = new AreaVerde(id, nombre, sector, superficie, descripcion, codigoMesh);
        mapService.updateAreaVerde(updatedArea);

        return "redirect:/admin-panel?section=areas-verdes";
    }

    @PostMapping("/admin-panel/delete-edificio")
    public String deleteEdificio(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        mapService.deleteEdificio(id);
        return "redirect:/admin-panel?section=edificios";
    }

    @PostMapping("/admin-panel/delete-area-verde")
    public String deleteAreaVerde(@RequestParam("id") Integer id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/acceso?error=unauthorized";
        }
        mapService.deleteAreaVerde(id);
        return "redirect:/admin-panel?section=areas-verdes";
    }
}
