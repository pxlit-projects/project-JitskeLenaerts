package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post,Long> {
    List<Post> findByContentContainingIgnoreCase(String content);
    List<Post> findByAuthorContainingIgnoreCase(String author);
    @Query("SELECT p FROM Post p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Post> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}