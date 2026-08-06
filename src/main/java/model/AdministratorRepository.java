package model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Integer> {

    Optional<Administrator> findByUsername(String username);

    Optional<Administrator> findByUsernameAndPassword(String username, String password);

    boolean existsByUsername(String username);
}
