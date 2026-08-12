package model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AreaVerdeRepository extends JpaRepository<AreaVerde, Integer> {

    List<AreaVerde> findByCodigoMeshIgnoreCase(String codigoMesh);

    List<AreaVerde> findByCodigoMesh(String codigoMesh);
}
