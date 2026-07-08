package controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @GetMapping("/acceso")
    public String loginPage(HttpSession session) {
        // If already logged in, redirect directly to admin panel
        if (session.getAttribute("user") != null) {
            return "redirect:/admin-panel";
        }
        return "login";
    }

    @PostMapping("/acceso")
    public String login(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session) {
        
        // Simple mock credentials validation
        if ("admin".equals(username) && "admin123".equals(password)) {
            session.setAttribute("user", username);
            return "redirect:/admin-panel";
        }
        
        return "redirect:/acceso?error=true";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/acceso?logout=true";
    }
}
