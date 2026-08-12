package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"app", "controller", "model"})
@EnableJpaRepositories(basePackages = "model")
@EntityScan(basePackages = "model")
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);
	}

}

