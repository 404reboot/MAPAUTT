package controller;

import model.AreaVerde;
import model.Edificio;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.List;

@Controller
public class AdminPanelController {

    @GetMapping("/admin-panel")
    public String adminPanel(@RequestParam(name = "section", defaultValue = "edificios") String section, Model model) {
        // Validation to prevent loading arbitrary strings
        if (!"edificios".equals(section) && !"areas-verdes".equals(section)) {
            section = "edificios";
        }
        
        model.addAttribute("activeSection", section);
        
        // Mock data for Buildings
        List<Edificio> edificios = Arrays.asList(
            new Edificio(1L, "Edificio A (Ciencias)", "ED-SCI-01", 4, "Activo"),
            new Edificio(2L, "Edificio B (Ingeniería)", "ED-ENG-02", 5, "Activo"),
            new Edificio(3L, "Edificio C (Biblioteca)", "ED-LIB-03", 2, "En Mantenimiento"),
            new Edificio(4L, "Edificio D (Administración)", "ED-ADM-04", 3, "Activo"),
            new Edificio(5L, "Edificio E (Cafetería)", "ED-CAF-05", 1, "Activo")
        );
        model.addAttribute("edificios", edificios);

        // Mock data for Green Areas
        List<AreaVerde> areasVerdes = Arrays.asList(
            new AreaVerde(1L, "Jardín Central", "Zona Norte", 1200.5, "Aspersión", "02/07/2026"),
            new AreaVerde(2L, "Bosque de Pinos", "Zona Sur", 4500.0, "Manual", "15/06/2026"),
            new AreaVerde(3L, "Parque de Lectura", "Zona Este", 850.0, "Goteo", "28/06/2026"),
            new AreaVerde(4L, "Plaza de la Cafetería", "Zona Centro", 600.2, "Goteo", "01/07/2026")
        );
        model.addAttribute("areasVerdes", areasVerdes);

        return "admin_panel";
    }
}
