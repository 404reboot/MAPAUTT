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
<<<<<<< HEAD
        model.addAttribute("title", "¡Bienvenido al MAPA de la UTTECAM!");
        model.addAttribute("message", "Vive una experiencia inolvidable con nuestros alrededores.");
=======
        model.addAttribute("title", "¡Bienvenido a MAPAUTT!");
        model.addAttribute("message", "Explora la Universidad Tecnologia de Tecamachalco de forma interactiva");
>>>>>>> 409cccf2f71bd74db1ae8d4b2e3339743698a8e6
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        model.addAttribute("serverTime", LocalDateTime.now().format(formatter));
        
        List<String> features = Arrays.asList(
            "🌿 Espacios naturales",
            "📍 Ubicación en tiempo real",
            "💚Espacios para descansar y convivir",
            "🌸 Información de cada espacio"
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
