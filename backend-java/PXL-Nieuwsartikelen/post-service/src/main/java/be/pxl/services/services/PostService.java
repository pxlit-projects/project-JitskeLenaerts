package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.exception.TitleAlreadyExistsException;
import be.pxl.services.repository.PostRepository;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

    private Post mapToPost(PostRequest request) {
        log.debug("Mapping PostRequest to Post: {}", request);
        return Post.builder()
                .id(request.getId())
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor())
                .authorId(request.getAuthorId())
                .category(request.getCategory())
                .state(request.getState())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    private PostResponse mapToPostResponse(Post post) {
        log.debug("Mapping Post to PostResponse: {}", post);
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .authorId(post.getAuthorId())
                .category(post.getCategory())
                .state(post.getState())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private void sendNotification(String message, String sender) {
        NotificationRequest notification = NotificationRequest.builder()
                .message(message)
                .sender(sender)
                .build();
        notificationClient.sendNotification(notification);
        log.info("Notification sent: {}", notification);
    }

    @Override
    public List<PostResponse> getPostsByAuthorIdAndState(Long userId, State state, String username) {
        log.info("Fetching posts for user '{}' with state '{}' and author ID: {}", username, state, userId);
        return postRepository.findPostsByAuthorIdAndState(userId, state).stream()
                .map(this::mapToPostResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getAllPosts() {
        log.info("Fetching all posts");
        return postRepository.findAll().stream()
                .map(this::mapToPostResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getPublishedPosts() {
        log.info("Fetching all published posts");
        return postRepository.findPostsByState(State.PUBLISHED).stream()
                .map(this::mapToPostResponse)
                .toList();
    }

    @Override
    public List<PostResponse> getPostsByState(State state, String username, Long userId) {
        log.info("Fetching posts with state '{}' for user '{}'", state, username);
        return postRepository.findPostsByState(state).stream()
                .map(this::mapToPostResponse)
                .toList();
    }

    @Override
    public PostResponse createPost(PostRequest request, String username, Long userId) {
        log.info("Creating post for user '{}': {}", username, request);

        postRepository.findByTitle(request.getTitle()).ifPresent(post -> {
            log.error("Post creation failed. Title '{}' already exists", request.getTitle());
            throw new TitleAlreadyExistsException("A post with title '" + request.getTitle() + "' already exists.");
        });

        Post post = mapToPost(request);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(username);
        post.setAuthorId(userId);
        post.setCategory(request.getCategory());
        post.setState(request.getState());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        sendNotification("Post created", username);
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse getPostById(Long id, String username, Long userId) {
        log.info("Fetching post with ID '{}' for user '{}'", id, username);
        return postRepository.findById(id)
                .map(this::mapToPostResponse)
                .orElseThrow(() -> {
                    log.error("Post with ID '{}' not found", id);
                    return new PostNotFoundException("Post not found with ID: " + id);
                });
    }

    @Override
    public void deletePost(Long id, String username, Long userId) {
        log.info("Deleting post with ID '{}' by user '{}'", id, username);
        Post post = postRepository.findById(id).orElseThrow(() -> {
            log.error("Delete failed. Post with ID '{}' not found", id);
            return new PostNotFoundException("Post not found with ID: " + id);
        });

        postRepository.delete(post);
        log.info("Post with ID '{}' deleted successfully", id);
    }

    @Override
    public PostResponse savePostAsConcept(Long id, String username, Long userId) {
        log.info("Saving post with ID '{}' as concept for user '{}'", id, username);
        Post post = postRepository.findById(id).orElseThrow(() -> {
            log.error("Post with ID '{}' not found", id);
            return new PostNotFoundException("Post not found with ID: " + id);
        });

        post.setState(State.CONCEPT);
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        sendNotification("Post saved as concept", username);
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse updatePost(PostRequest request, String username, Long userId) {
        log.info("Updating post with ID '{}' for user '{}'", request.getId(), username);

        if (request.getId() == null) {
            log.error("Update failed. Post ID is missing.");
            throw new IllegalArgumentException("Cannot update a post without an ID.");
        }

        Post post = postRepository.findById(request.getId()).orElseThrow(() -> {
            log.error("Update failed. Post with ID '{}' not found", request.getId());
            return new PostNotFoundException("Post not found with ID: " + request.getId());
        });

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        post.setAuthorId(userId);
        post.setCategory(request.getCategory());
        post.setState(request.getState());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        log.info("Post with ID '{}' updated successfully", request.getId());
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse publishPost(Long id, String username, Long userId) {
        log.info("Publishing post with ID '{}' for user '{}'", id, username);

        Post post = postRepository.findById(id)
                .filter(p -> p.getState() == State.APPROVED)
                .orElseThrow(() -> {
                    log.error("Publish failed. Post with ID '{}' not in APPROVED state", id);
                    return new IllegalArgumentException("Post not found or not in APPROVED state");
                });

        post.setState(State.PUBLISHED);
        postRepository.save(post);

        log.info("Post with ID '{}' published successfully", id);
        return mapToPostResponse(post);
    }

    @PreDestroy
    public void cleanUp() {
        log.info("Cleaning up resources before shutdown");
    }
}
