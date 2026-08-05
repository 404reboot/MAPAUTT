package model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository extends JpaRepository<Plant,Integer> {

     List<Plant> findByNombreIgnoreCase(String nombre);
    List<Plant>findByNombre(String nombre);

}
