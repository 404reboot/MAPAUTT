package app.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the public-facing pages: root redirect and the 3D campus map page.
 */
@Controller
public class PageController {

    /**
     * Redirects the root URL to the map page.
     */
    @GetMapping("/")
    public String root() {
        return "redirect:/mapa";
    }

    /**
     * Renders the 3D campus map page.
     */
    @GetMapping("/mapa")
    public String mapa() {
        return "mapa";
    }
}
