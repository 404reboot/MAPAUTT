package model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface Edificiorepository extends JpaRepository<Edificio, Integer> {
    List<Edificio> findByNombre(String nombre);

    List<Edificio> findByNombreContainingIgnoreCase(String nombre);
}
