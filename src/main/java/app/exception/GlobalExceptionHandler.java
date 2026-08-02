package app.exception;

import java.net.URI;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralized exception handling that produces RFC 7807 ProblemDetail responses
 * for domain-specific and concurrency exceptions.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(LocationNotFoundException.class)
    public ProblemDetail handleLocationNotFound(LocationNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Location Not Found");
        problem.setType(URI.create("about:blank"));
        problem.setProperty("mapKey", ex.getMapKey());
        return problem;
    }

    @ExceptionHandler(LocationTypeMismatchException.class)
    public ProblemDetail handleTypeMismatch(LocationTypeMismatchException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Location Type Mismatch");
        problem.setType(URI.create("about:blank"));
        problem.setProperty("mapKey", ex.getMapKey());
        problem.setProperty("expectedType", ex.getExpected().name());
        problem.setProperty("actualType", ex.getActual().name());
        return problem;
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ProblemDetail handleOptimisticLock(OptimisticLockingFailureException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                "The resource was modified by another transaction. Please retry.");
        problem.setTitle("Concurrent Modification Conflict");
        problem.setType(URI.create("about:blank"));
        return problem;
    }
}
