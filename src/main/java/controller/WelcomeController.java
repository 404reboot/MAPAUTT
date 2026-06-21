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
        model.addAttribute("message", "Tu aplicación Spring Boot está lista y funcionando con Thymeleaf.");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        model.addAttribute("serverTime", LocalDateTime.now().format(formatter));
        
        List<String> features = Arrays.asList(
            "Configuración automática con Spring Boot",
            "Plantillas dinámicas con Thymeleaf",
            "Recarga automática activa (DevTools)",
            "Controladores MVC estructurados"
        );
        model.addAttribute("features", features);
        
        return "welcome";
    }
}
