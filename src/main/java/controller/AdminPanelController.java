package controller;

import model.AreaVerde;
import model.Edificio;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

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
}
