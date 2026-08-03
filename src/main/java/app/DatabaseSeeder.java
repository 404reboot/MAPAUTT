package app;

import model.Edificio;
import model.EdificioRepository;
import model.AreaVerde;
import model.AreaVerdeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private EdificioRepository edificioRepository;

    @Autowired
    private AreaVerdeRepository areaVerdeRepository;

    @Override
    public void run(String... args) throws Exception {
        seedEdificios();
        seedAreasVerdes();
    }

    private void seedEdificios() {
        if (edificioRepository.count() == 0) {
            edificioRepository.save(new Edificio(null, "Almacen y Salon de Taekwondo", "General", 1, "Activo", "Almacen_y_Salon_de_Taekwondo"));
            edificioRepository.save(new Edificio(null, "Cafeteria", "General", 1, "Activo", "Cafeteria"));
            edificioRepository.save(new Edificio(null, "Caseta Vigilancia Entrada 1", "General", 1, "Activo", "Caseta_Vigilancia_Entrada_1"));
            edificioRepository.save(new Edificio(null, "Caseta Vigilancia Entrada 2", "General", 1, "Activo", "Caseta_Vigilancia_Entrada_2"));
            edificioRepository.save(new Edificio(null, "Caseta de Informacion", "General", 1, "Activo", "Caseta_de_Informacion"));
            edificioRepository.save(new Edificio(null, "Caseta de Vigilancia de Entrada 1", "General", 1, "Activo", "Caseta_de_Vigilancia_de_Entrada_1"));
            edificioRepository.save(new Edificio(null, "Caseta de Vigilancia de Entrada 2", "General", 1, "Activo", "Caseta_de_Vigilancia_de_Entrada_2"));
            edificioRepository.save(new Edificio(null, "Caseta de Vigilancia de Entrada 3", "General", 1, "Activo", "Caseta_de_Vigilancia_de_Entrada_3"));
            edificioRepository.save(new Edificio(null, "Edificio D y Biblioteca", "General", 1, "Activo", "Edificio_D_y_Biblioteca"));
            edificioRepository.save(new Edificio(null, "Edificio E", "General", 1, "Activo", "Edificio_E"));
            edificioRepository.save(new Edificio(null, "Edificio F", "General", 1, "Activo", "Edificio_F"));
            edificioRepository.save(new Edificio(null, "Edificio G", "General", 1, "Activo", "Edificio_G"));
            edificioRepository.save(new Edificio(null, "Edificio H", "General", 1, "Activo", "Edificio_H"));
            edificioRepository.save(new Edificio(null, "Edificio K", "General", 1, "Activo", "Edificio_K"));
            edificioRepository.save(new Edificio(null, "Edificio L", "General", 1, "Activo", "Edificio_L"));
            edificioRepository.save(new Edificio(null, "Edificio M", "General", 1, "Activo", "Edificio_M"));
            edificioRepository.save(new Edificio(null, "Edificio R", "General", 1, "Activo", "Edificio_R"));
            edificioRepository.save(new Edificio(null, "Edificio T", "General", 1, "Activo", "Edificio_T"));
            edificioRepository.save(new Edificio(null, "Laboratorio de Serigrafia", "General", 1, "Activo", "Laboratorio_de_Serigrafia"));
            edificioRepository.save(new Edificio(null, "Terreno Irregular del Campus", "General", 1, "Activo", "Terreno_Irregular_del_Campus"));
        }
    }

    private void seedAreasVerdes() {
        if (areaVerdeRepository.count() == 0) {
            areaVerdeRepository.save(new AreaVerde(0, "Camino", "Campus", 0.0, "Área verde generada", "Camino"));
            areaVerdeRepository.save(new AreaVerde(0, "Campo de Beisbol", "Campus", 0.0, "Área verde generada", "Campo_de_Beisbol"));
            areaVerdeRepository.save(new AreaVerde(0, "Cancha Techada No", "Campus", 0.0, "Área verde generada", "Cancha_Techada_No"));
            areaVerdeRepository.save(new AreaVerde(0, "Cancha Techada No. 1", "Campus", 0.0, "Área verde generada", "Cancha_Techada_No__1"));
            areaVerdeRepository.save(new AreaVerde(0, "Cancha Techada No. 2", "Campus", 0.0, "Área verde generada", "Cancha_Techada_No__2"));
            areaVerdeRepository.save(new AreaVerde(0, "Cancha de Beisbol", "Campus", 0.0, "Área verde generada", "Cancha_de_Beisbol"));
            areaVerdeRepository.save(new AreaVerde(0, "Cancha de Futbol", "Campus", 0.0, "Área verde generada", "Cancha_de_Futbol"));
            areaVerdeRepository.save(new AreaVerde(0, "Estacionamiento 1", "Campus", 0.0, "Área verde generada", "Estacionamiento_1"));
            areaVerdeRepository.save(new AreaVerde(0, "Estacionamiento Norte", "Campus", 0.0, "Área verde generada", "Estacionamiento_Norte"));
            areaVerdeRepository.save(new AreaVerde(0, "Estacionamiento Oeste", "Campus", 0.0, "Área verde generada", "Estacionamiento_Oeste"));
            areaVerdeRepository.save(new AreaVerde(0, "Huerta Composta", "Campus", 0.0, "Área verde generada", "Huerta_Composta"));
            areaVerdeRepository.save(new AreaVerde(0, "Huerta y Composta", "Campus", 0.0, "Área verde generada", "Huerta_y_Composta"));
            areaVerdeRepository.save(new AreaVerde(0, "Invernaderos", "Campus", 0.0, "Área verde generada", "Invernaderos"));
            areaVerdeRepository.save(new AreaVerde(0, "Pasillos", "Campus", 0.0, "Área verde generada", "Pasillos"));
            areaVerdeRepository.save(new AreaVerde(0, "Presa de Agua", "Campus", 0.0, "Área verde generada", "Presa_de_Agua"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Con Campana", "Campus", 0.0, "Área verde generada", "Zona_Verde_Con_Campana"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Con Campana Central", "Campus", 0.0, "Área verde generada", "Zona_Verde_Con_Campana_Central"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Con Fuente", "Campus", 0.0, "Área verde generada", "Zona_Verde_Con_Fuente"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Este", "Campus", 0.0, "Área verde generada", "Zona_Verde_Este"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Este No", "Campus", 0.0, "Área verde generada", "Zona_Verde_Este_No"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Oeste", "Campus", 0.0, "Área verde generada", "Zona_Verde_Oeste"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Sur", "Campus", 0.0, "Área verde generada", "Zona_Verde_Sur"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Sureste", "Campus", 0.0, "Área verde generada", "Zona_Verde_Sureste"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde Suroeste", "Campus", 0.0, "Área verde generada", "Zona_Verde_Suroeste"));

            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Cancha Techada No", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Cancha_Techada_No"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Cancha Techada No. 1", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Cancha_Techada_No__1"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Entrada 1", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Entrada_1"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Entrada 2", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Entrada_2"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Entrada 3", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Entrada_3"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde de Pasillos", "Campus", 0.0, "Área verde generada", "Zona_Verde_de_Pasillos"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Almacen", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Almacen"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio D", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_D"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio E", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_E"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio F", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_F"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio G", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_G"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio H", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_H"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio K", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_K"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio L", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_L"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio M", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_M"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio R", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_R"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Edificio T", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Edificio_T"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Estacionamiento 1", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Estacionamiento_1"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Estacionamiento No", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Estacionamiento_No"));
            areaVerdeRepository.save(new AreaVerde(0, "Zona Verde del Estacionamiento Norte", "Campus", 0.0, "Área verde generada", "Zona_Verde_del_Estacionamiento_Norte"));
        }
    }
}
