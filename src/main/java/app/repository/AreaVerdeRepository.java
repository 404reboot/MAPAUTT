package app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.model.AreaVerde;

/**
 * Repository for green-area detail records.
 */
@Repository
public interface AreaVerdeRepository extends JpaRepository<AreaVerde, Long> {

    @Query("SELECT av FROM AreaVerde av JOIN av.mapLocation ml WHERE ml.mapKey = :mapKey")
    Optional<AreaVerde> findByMapKey(@Param("mapKey") String mapKey);
}
