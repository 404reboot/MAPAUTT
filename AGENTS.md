# AGENTS.md - MAPAUTT Project Instructions

## Overview
MAPAUTT is an interactive campus map web application built with **Java 25**, **Spring Boot 4.1**, **Thymeleaf**, and **MariaDB JPA**.

## Environment Setup
- **Nix Environment**: The repository includes a `flake.nix` that provides `jdk25`, `maven`, `mariadb`, and `cloudflared`.
- **Database Management**: MariaDB is managed **externally** by the developer on `localhost:3306` (database: `mapavutt`, user: `root`). Agents should assume the database server is already running when executing tests or running the application.

## Directory & Package Structure
The primary Spring Boot application is located in the current workspace directory.

- Root level:
  - `flake.nix`: Development environment definition.
  - `mariadb_cmd.md`: MariaDB startup & shutdown reference commands.
  - `AGENTS.md`: Agent guidelines and instructions.
- Subdirectory `src/main/java`:
  - `app/`: Contains application entry point (`Main.java`).
  - `controller/`: Spring controllers, REST endpoints, and service logic (`AdminPanelController`, `LoginController`, `MapRestController`, `WelcomeController`, `MapService`).
  - `model/`: Entity definitions and Spring Data JPA Repositories (`Administrator`, `AdministratorRepository`, `AreaVerde`, `Edificio`).
- Subdirectory `src/main/resources`:
  - `application.properties`: Configuration settings.
  - `templates/`: Thymeleaf HTML views (`admin_panel.html`, `login.html`, `mapa.html`, `welcome.html`, and `fragments/`).
  - `static/`: Static assets (CSS, JS, images).

## Architecture & Code Guidelines
1. **Strict MVC Pattern**: Maintain the pure **Model-View-Controller** structure.
2. **Package Boundaries**: **Do NOT create additional package directories** inside `src/main/java`. Keep all code organized within the existing packages (`app`, `controller`, `model`).
3. **Simplicity First**: Write straightforward, functional, and maintainable code without adding unnecessary abstract layers or complex design patterns.
4. **Thymeleaf Modularization**: HTML views must be modularized using Thymeleaf fragments (located in `src/main/resources/templates/fragments/`) to avoid spaghetti code and ensure view component reusability.
5. **CSS Modularization**: CSS styles must also be modularized and logically structured in `src/main/resources/static/` (e.g. component/page specific stylesheets) rather than written as monolithic or unorganized style blocks.

## Common Commands
All Maven commands should be run directly from the project root directory.

- **Build Project**:
  ```bash
  ./mvnw clean compile
  ```
- **Package Application**:
  ```bash
  ./mvnw clean package
  ```
- **Run Spring Boot App**:
  ```bash
  ./mvnw spring-boot:run
  ```
- **Run Tests**:
  ```bash
  ./mvnw test
  ```

## Database Settings (`application.properties`)
- Driver: `org.mariadb.jdbc.Driver`
- JDBC URL: `jdbc:mariadb://localhost:3306/mapavutt`
- DDL Auto: `update`
