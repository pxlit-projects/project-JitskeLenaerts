package be.pxl.services.repository;

import be.pxl.services.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface PostRepository extends JpaRepository<Post,Long>{

}
