-- Script DDL Nativo de MariaDB para MAPAUTT
-- Evita errores de sintaxis DDL de Hibernate en MariaDB

CREATE TABLE IF NOT EXISTS administrator (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS edificio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    carreras VARCHAR(255),
    codigo_mesh VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS area_verde (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    sector VARCHAR(255),
    superficie DOUBLE,
    descripcion VARCHAR(255),
    codigo_mesh VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS especies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    reino VARCHAR(255),
    division_phylum VARCHAR(255),
    clase VARCHAR(255),
    subclase VARCHAR(255),
    orden VARCHAR(255),
    familia VARCHAR(255),
    subfamilia VARCHAR(255),
    genero VARCHAR(255),
    especie VARCHAR(255),
    variedad VARCHAR(255),
    asset_id VARCHAR(255),
    observaciones TEXT,
    fecha_registro DATETIME(6)
);

CREATE TABLE IF NOT EXISTS area_verde_especie (
    area_verde_id INT NOT NULL,
    especie_id INT NOT NULL,
    PRIMARY KEY (area_verde_id, especie_id),
    CONSTRAINT fk_ave_area FOREIGN KEY (area_verde_id) REFERENCES area_verde (id) ON DELETE CASCADE,
    CONSTRAINT fk_ave_especie FOREIGN KEY (especie_id) REFERENCES especies (id) ON DELETE CASCADE
);

