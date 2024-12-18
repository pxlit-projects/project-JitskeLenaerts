package be.pxl.services.controller;

import be.pxl.services.domain.State;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;
    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/filter/{state}")
    public ResponseEntity<?> getPostsByAuthorAndState(@RequestHeader Long authorId, @PathVariable State state) {
        log.info("Handling request [GET] /api/post/filter/{}", state.name());
        return ResponseEntity.ok(postService.getPostsByAuthorIdAndState(authorId, state));
    }

    @GetMapping("/state/{state}")  
    public ResponseEntity<?> getPostsByState(@PathVariable State state) {
        log.info("Handling request [GET] /api/post/state/{}", state.name());
        return ResponseEntity.ok(postService.getPostsByState(state));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        PostResponse postResponse = postService.getPostById(id);
        log.info("Fetching specific post with id {}", id);
        return ResponseEntity.ok(postResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        log.info("Deleted post with ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<PostResponse> publishPost(@PathVariable Long id) {
        log.info("Publishing post with ID {}.", id);
        PostResponse publishedPost = postService.publishPost(id);
        return ResponseEntity.ok(publishedPost);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest, @RequestHeader String username, @RequestHeader Long id) {
        PostResponse createdPost = postService.createPost(postRequest, username, id);
        log.info("Creating new post");
        rabbitTemplate.convertAndSend("postQueue", "Added post from author: " + username);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @PutMapping("/{id}/concept")
    public ResponseEntity<PostResponse> savePostAsConcept(@PathVariable Long id) {
        PostResponse savedPost = postService.savePostAsConcept(id);
        log.info("Save post as concept");
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        postRequest.setId(id);
        PostResponse updatedPost = postService.updatePost(postRequest);
        log.info("Updating post with id {}", id);
        return ResponseEntity.ok(updatedPost);
    }
}
