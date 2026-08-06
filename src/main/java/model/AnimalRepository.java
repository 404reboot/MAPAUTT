package model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalRepository extends JpaRepository<Animal,Integer> {

    List<Animal> findByNombreIgnoreCase(String nombre);
    List<Animal> findByNombre(String nombre);
}
