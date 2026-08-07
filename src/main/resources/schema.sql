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

CREATE TABLE IF NOT EXISTS plant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    reino VARCHAR(255) DEFAULT 'Plantae',
    subreino VARCHAR(255),
    superdivision VARCHAR(255),
    division VARCHAR(255),
    clase VARCHAR(255),
    orden VARCHAR(255),
    familia VARCHAR(255),
    genero VARCHAR(255),
    especie VARCHAR(255),
    variedad VARCHAR(255),
    asset_id VARCHAR(255),
    observaciones TEXT,
    fecha_registro DATETIME(6)
);

CREATE TABLE IF NOT EXISTS animal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    reino VARCHAR(255) DEFAULT 'Animalia',
    division_phylum VARCHAR(255),
    clase VARCHAR(255),
    subclase VARCHAR(255),
    orden VARCHAR(255),
    familia VARCHAR(255),
    subfamilia VARCHAR(255),
    genero VARCHAR(255),
    especie VARCHAR(255),
    asset_id VARCHAR(255),
    observaciones TEXT,
    fecha_registro DATETIME(6)
);

CREATE TABLE IF NOT EXISTS area_verde_plant (
    area_verde_id INT NOT NULL,
    plant_id INT NOT NULL,
    PRIMARY KEY (area_verde_id, plant_id),
    CONSTRAINT fk_avp_area FOREIGN KEY (area_verde_id) REFERENCES area_verde (id) ON DELETE CASCADE,
    CONSTRAINT fk_avp_plant FOREIGN KEY (plant_id) REFERENCES plant (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS area_verde_animal (
    area_verde_id INT NOT NULL,
    animal_id INT NOT NULL,
    PRIMARY KEY (area_verde_id, animal_id),
    CONSTRAINT fk_ava_area FOREIGN KEY (area_verde_id) REFERENCES area_verde (id) ON DELETE CASCADE,
    CONSTRAINT fk_ava_animal FOREIGN KEY (animal_id) REFERENCES animal (id) ON DELETE CASCADE
);
