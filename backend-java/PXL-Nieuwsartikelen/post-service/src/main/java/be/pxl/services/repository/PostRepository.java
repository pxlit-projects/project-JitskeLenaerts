package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post,Long> {
    Optional<Post> findByTitle(String title);
    List<Post> findPostsByAuthorIdAndState(Long authorId, State state);
    List<Post> findPostsByState(State state);
}