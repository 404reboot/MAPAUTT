package model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EdificioRepository extends JpaRepository<Edificio, Integer> {

    List<Edificio> findByCodigoMeshIgnoreCase(String codigoMesh);

    List<Edificio> findByCodigoMesh(String codigoMesh);
}
