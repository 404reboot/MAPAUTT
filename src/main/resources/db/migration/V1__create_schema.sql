-- V1: Create the campus map location schema
-- Three tables: shared identity (map_location), installation details (instalacion),
-- and green-area details (area_verde).

CREATE TABLE map_location (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    map_key         VARCHAR(100) NOT NULL,
    glb_object_name VARCHAR(255) NOT NULL,
    location_type   VARCHAR(30)  NOT NULL,
    display_name    VARCHAR(150) NOT NULL,
    description     TEXT         NULL,
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    version         BIGINT       NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_map_location_map_key UNIQUE (map_key),
    CONSTRAINT uk_map_location_glb_object_name UNIQUE (glb_object_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE instalacion (
    location_id        BIGINT      NOT NULL,
    facility_type      VARCHAR(30) NOT NULL,
    use_description    VARCHAR(500) NULL,
    academic_programs  TEXT         NULL,
    floor_count        INT          NULL,
    operational_status VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    PRIMARY KEY (location_id),
    CONSTRAINT fk_instalacion_map_location
        FOREIGN KEY (location_id) REFERENCES map_location (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE area_verde (
    location_id  BIGINT        NOT NULL,
    sector       VARCHAR(100)  NULL,
    surface_area DECIMAL(12,2) NULL,
    PRIMARY KEY (location_id),
    CONSTRAINT fk_area_verde_map_location
        FOREIGN KEY (location_id) REFERENCES map_location (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
