package app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.model.Instalacion;

/**
 * Repository for installation detail records.
 */
@Repository
public interface InstalacionRepository extends JpaRepository<Instalacion, Long> {

    @Query("SELECT i FROM Instalacion i JOIN i.mapLocation ml WHERE ml.mapKey = :mapKey")
    Optional<Instalacion> findByMapKey(@Param("mapKey") String mapKey);
}
