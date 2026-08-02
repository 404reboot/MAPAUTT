package app.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Exception handler for MVC (non-REST) controllers. Catches known domain exceptions
 * thrown by admin panel handlers and redirects with user-friendly error messages
 * instead of exposing a raw Whitelabel Error Page.
 *
 * <p>Only domain-specific exceptions are handled here. Unexpected exceptions
 * (NPE, ClassCastException, etc.) are left to Spring's default error handling,
 * which surfaces full stack traces during development for easier debugging.
 */
@ControllerAdvice(basePackages = "app.controller.mvc")
public class MvcExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(MvcExceptionHandler.class);

    @ExceptionHandler(LocationNotFoundException.class)
    public String handleLocationNotFound(LocationNotFoundException ex, RedirectAttributes redirectAttributes) {
        log.warn("MVC location not found: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("errorMessage",
                "Ubicacion no encontrada: " + ex.getMapKey());
        return "redirect:/admin-panel";
    }

    @ExceptionHandler(LocationTypeMismatchException.class)
    public String handleTypeMismatch(LocationTypeMismatchException ex, RedirectAttributes redirectAttributes) {
        log.warn("MVC type mismatch: {}", ex.getMessage());
        redirectAttributes.addFlashAttribute("errorMessage",
                "Tipo de ubicacion incompatible para: " + ex.getMapKey());
        return "redirect:/admin-panel";
    }
}
