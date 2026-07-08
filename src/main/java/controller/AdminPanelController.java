package controller;

import model.AreaVerde;
import model.Edificio;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.List;

@Controller
public class AdminPanelController {

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
        
        // Mock data for Buildings
        List<Edificio> edificios = Arrays.asList(
            new Edificio(1L, "E", "Alimentos", 4, "Activo"),
            new Edificio(2L, "F", "Administración", 5, "Activo"),
            new Edificio(3L, "T", "", 2, "En Mantenimiento"),
            new Edificio(3L, "R", "Mecatrónica", 2, "En Mantenimiento"),
            new Edificio(4L, "M", "Agricultura", 3, "Activo"),
            new Edificio(5L, "K", "Tecnologías de la Información", 1, "Activo"),
            new Edificio(5L, "H", "Contaduria", 1, "Activo")
        );
        model.addAttribute("edificios", edificios);

        // Mock data for Green Areas
        List<AreaVerde> areasVerdes = Arrays.asList(
            new AreaVerde(1, "Jardin 1", "Zona Norte", 1200.5, "Ubicado frente al edificio H"),
            new AreaVerde(2, "Pasillos verdes", "Zona Sur", 4500.0, "Predomina flora como el Ciprés y arbustos"),
            new AreaVerde(3, "Fuente de agua", "Zona Este", 850.0, "Ubucado a un lado de la cafetería"),
            new AreaVerde(4, "Prados", "Zona Centro", 600.2, "")
        );
        model.addAttribute("areasVerdes", areasVerdes);

        return "admin_panel";
    }
}
