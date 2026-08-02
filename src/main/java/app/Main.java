package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "app",
    "app.model",
    "app.repository",
    "app.service",
    "app.dto",
    "app.controller.rest",
    "app.controller.mvc"
})
@EntityScan(basePackages = "app.model")
@EnableJpaRepositories(basePackages = "app.repository")
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
