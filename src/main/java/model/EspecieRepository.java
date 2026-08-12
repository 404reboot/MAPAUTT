package model;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecieRepository extends JpaRepository<Especie, Integer> {

    List<Especie> findByNombreIgnoreCase(String nombre);
    List<Especie> findByNombre(String nombre);
    List<Especie> findByReinoIgnoreCase(String reino);
}
