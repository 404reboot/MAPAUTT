package controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Controller
public class WelcomeController {

    @GetMapping("/")
    public String welcome(Model model) {
        model.addAttribute("title", "¡Bienvenido a MAPAUTT!");
        model.addAttribute("message", "Vive una experiencia inolvidable con nuestros alrededores.");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        model.addAttribute("serverTime", LocalDateTime.now().format(formatter));
        
        List<String> features = Arrays.asList(
            "Espacios naturales",
            "Ubicación en tiempo real",
            "Espacios para descansar y convivir",
            "Datos sobre espacios"
        );
        model.addAttribute("features", features);
        
        return "welcome";
    }

    @GetMapping("/mapa")
    public String mapa(Model model) {
        model.addAttribute("title", "Mapa Interactivo del Campus - MAPAUTT");
        return "mapa";
    }
}
