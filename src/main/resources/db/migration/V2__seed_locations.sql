-- V2: Seed all 54 campus map locations (29 installations + 25 green areas)
-- Data derived from the authoritative GLB model inventory.

-- =============================================
-- 29 Installation locations
-- =============================================
INSERT INTO map_location (map_key, glb_object_name, location_type, display_name, active, version) VALUES
('almacen-taekwondo', 'Almacen y Salon de Taekwondo', 'INSTALACION', 'Almacen y Salon de Taekwondo', TRUE, 0),
('cafeteria', 'Cafeteria', 'INSTALACION', 'Cafeteria', TRUE, 0),
('camino', 'Camino', 'INSTALACION', 'Camino', TRUE, 0),
('campo-beisbol', 'Campo de Beisbol', 'INSTALACION', 'Campo de Beisbol', TRUE, 0),
('cancha-futbol', 'Cancha de Futbol', 'INSTALACION', 'Cancha de Futbol', TRUE, 0),
('cancha-techada-1', 'Cancha Techada 1', 'INSTALACION', 'Cancha Techada 1', TRUE, 0),
('cancha-techada-2', 'Cancha Techada 2', 'INSTALACION', 'Cancha Techada 2', TRUE, 0),
('caseta-informacion', 'Caseta de Informacion .', 'INSTALACION', 'Caseta de Informacion', TRUE, 0),
('caseta-vigilancia-1', 'Caseta de Vigilancia 1', 'INSTALACION', 'Caseta de Vigilancia 1', TRUE, 0),
('caseta-vigilancia-2', 'Caseta de Vigilancia 2', 'INSTALACION', 'Caseta de Vigilancia 2', TRUE, 0),
('caseta-vigilancia-3', 'Caseta de Vigilancia 3', 'INSTALACION', 'Caseta de Vigilancia 3', TRUE, 0),
('edificio-d', 'Edificio D.', 'INSTALACION', 'Edificio D', TRUE, 0),
('edificio-e', 'Edificio E.', 'INSTALACION', 'Edificio E', TRUE, 0),
('edificio-f', 'Edificio F', 'INSTALACION', 'Edificio F', TRUE, 0),
('edificio-g', 'Edificio G.', 'INSTALACION', 'Edificio G', TRUE, 0),
('edificio-h', 'Edificio H.', 'INSTALACION', 'Edificio H', TRUE, 0),
('edificio-k', 'Edificio K.', 'INSTALACION', 'Edificio K', TRUE, 0),
('edificio-l', 'Edificio L.', 'INSTALACION', 'Edificio L', TRUE, 0),
('edificio-m', 'Edificio M.', 'INSTALACION', 'Edificio M', TRUE, 0),
('edificio-r', 'Edificio R.', 'INSTALACION', 'Edificio R', TRUE, 0),
('edificio-t', 'Edificio T.', 'INSTALACION', 'Edificio T', TRUE, 0),
('estacionamiento-oeste', 'Estacionamiento 1.', 'INSTALACION', 'Estacionamiento Oeste', TRUE, 0),
('estacionamiento-este', 'Estacionamiento 2', 'INSTALACION', 'Estacionamiento Este', TRUE, 0),
('huerta-composta', 'Huerta Composta', 'INSTALACION', 'Huerta y Composta', TRUE, 0),
('invernaderos', 'Invernaderos .', 'INSTALACION', 'Invernaderos', TRUE, 0),
('laboratorio-serigrafia', 'Laboratorio de Serigrafia', 'INSTALACION', 'Laboratorio de Serigrafia', TRUE, 0),
('pasillos', 'Pasillos .', 'INSTALACION', 'Pasillos', TRUE, 0),
('presa', 'Presa .', 'INSTALACION', 'Presa', TRUE, 0),
('terreno-irregular', 'Terreno Irregular del Campus', 'INSTALACION', 'Terreno Irregular del Campus', TRUE, 0);

-- =============================================
-- 25 Green-area locations
-- =============================================
INSERT INTO map_location (map_key, glb_object_name, location_type, display_name, active, version) VALUES
('zona-verde-central-campana', 'Zona Verde Central de la Campana', 'AREA_VERDE', 'Zona Verde Central de la Campana', TRUE, 0),
('zona-verde-fuente', 'Zona Verde de la Fuente', 'AREA_VERDE', 'Zona Verde de la Fuente', TRUE, 0),
('zona-verde-cancha-techada', 'Zona Verde de la Cancha Techada', 'AREA_VERDE', 'Zona Verde de la Cancha Techada', TRUE, 0),
('zona-verde-entrada-1', 'Zona Verde de Entrada 1', 'AREA_VERDE', 'Zona Verde de Entrada 1', TRUE, 0),
('zona-verde-entrada-2', 'Zona Verde de Entrada 2', 'AREA_VERDE', 'Zona Verde de Entrada 2', TRUE, 0),
('zona-verde-pasillo', 'Zona Verde del Pasillo', 'AREA_VERDE', 'Zona Verde del Pasillo', TRUE, 0),
('zona-verde-edificio-d', 'Zona Verde del Edificio D', 'AREA_VERDE', 'Zona Verde del Edificio D', TRUE, 0),
('zona-verde-edificio-e', 'Zona Verde del Edificio E', 'AREA_VERDE', 'Zona Verde del Edificio E', TRUE, 0),
('zona-verde-edificio-f', 'Zona Verde del Edificio F.', 'AREA_VERDE', 'Zona Verde del Edificio F', TRUE, 0),
('zona-verde-edificio-g', 'Zona Verde del Edificio G', 'AREA_VERDE', 'Zona Verde del Edificio G', TRUE, 0),
('zona-verde-edificio-h', 'Zona Verde del Edificio H:', 'AREA_VERDE', 'Zona Verde del Edificio H', TRUE, 0),
('zona-verde-edificio-k', 'Zona Verde del Edificio K.', 'AREA_VERDE', 'Zona Verde del Edificio K', TRUE, 0),
('zona-verde-edificio-l', 'Zona Verde del Edificio L', 'AREA_VERDE', 'Zona Verde del Edificio L', TRUE, 0),
('zona-verde-edificio-m', 'Zona Verde del Edificio M', 'AREA_VERDE', 'Zona Verde del Edificio M', TRUE, 0),
('zona-verde-edificio-r', 'Zona Verde del Edificio R', 'AREA_VERDE', 'Zona Verde del Edificio R', TRUE, 0),
('zona-verde-edificio-t', 'Zona Verde del Edificio T', 'AREA_VERDE', 'Zona Verde del Edificio T', TRUE, 0),
('zona-verde-estacionamiento-1', 'Zona Verde del Estacionamiento 1', 'AREA_VERDE', 'Zona Verde del Estacionamiento 1', TRUE, 0),
('zona-verde-estacionamiento-2', 'Zona Verde del Estacionamiento 2', 'AREA_VERDE', 'Zona Verde del Estacionamiento 2', TRUE, 0),
('zona-verde-este', 'Zona Verde Este:', 'AREA_VERDE', 'Zona Verde Este', TRUE, 0),
('zona-verde-oeste', 'Zona Verde Oeste', 'AREA_VERDE', 'Zona Verde Oeste', TRUE, 0),
('zona-verde-sur', 'Zona Verde Sur', 'AREA_VERDE', 'Zona Verde Sur', TRUE, 0),
('zona-verde-sureste', 'Zona Verde Sureste', 'AREA_VERDE', 'Zona Verde Sureste', TRUE, 0),
('zona-verde-suroeste', 'Zona Verde Suroeste', 'AREA_VERDE', 'Zona Verde Suroeste', TRUE, 0),
('zona-verde-almacen', 'Zona Verde del Almacen.', 'AREA_VERDE', 'Zona Verde del Almacen', TRUE, 0),
('zona-verde-invernadero', 'Zona Verde del Invernadero', 'AREA_VERDE', 'Zona Verde del Invernadero', TRUE, 0);

-- =============================================
-- 29 Installation detail records
-- Uses SET to retrieve the corresponding map_location.id for each map_key.
-- =============================================
INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'almacen-taekwondo';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'cafeteria';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'PATH', 'ACTIVE' FROM map_location WHERE map_key = 'camino';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SPORTS', 'ACTIVE' FROM map_location WHERE map_key = 'campo-beisbol';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SPORTS', 'ACTIVE' FROM map_location WHERE map_key = 'cancha-futbol';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SPORTS', 'ACTIVE' FROM map_location WHERE map_key = 'cancha-techada-1';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SPORTS', 'ACTIVE' FROM map_location WHERE map_key = 'cancha-techada-2';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'caseta-informacion';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'caseta-vigilancia-1';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'caseta-vigilancia-2';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'caseta-vigilancia-3';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-d';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-e';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-f';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-g';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-h';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-k';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-l';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-m';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-r';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'BUILDING', 'ACTIVE' FROM map_location WHERE map_key = 'edificio-t';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'PARKING', 'ACTIVE' FROM map_location WHERE map_key = 'estacionamiento-oeste';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'PARKING', 'ACTIVE' FROM map_location WHERE map_key = 'estacionamiento-este';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'WATER_LAND', 'ACTIVE' FROM map_location WHERE map_key = 'huerta-composta';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'OTHER', 'ACTIVE' FROM map_location WHERE map_key = 'invernaderos';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'SERVICE', 'ACTIVE' FROM map_location WHERE map_key = 'laboratorio-serigrafia';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'PATH', 'ACTIVE' FROM map_location WHERE map_key = 'pasillos';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'WATER_LAND', 'ACTIVE' FROM map_location WHERE map_key = 'presa';

INSERT INTO instalacion (location_id, facility_type, operational_status)
SELECT id, 'WATER_LAND', 'ACTIVE' FROM map_location WHERE map_key = 'terreno-irregular';

-- =============================================
-- 25 Green-area detail records
-- =============================================
INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-central-campana';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-fuente';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-cancha-techada';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-entrada-1';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-entrada-2';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-pasillo';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-d';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-e';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-f';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-g';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-h';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-k';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-l';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-m';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-r';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-edificio-t';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-estacionamiento-1';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-estacionamiento-2';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-este';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-oeste';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-sur';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-sureste';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-suroeste';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-almacen';

INSERT INTO area_verde (location_id)
SELECT id FROM map_location WHERE map_key = 'zona-verde-invernadero';
