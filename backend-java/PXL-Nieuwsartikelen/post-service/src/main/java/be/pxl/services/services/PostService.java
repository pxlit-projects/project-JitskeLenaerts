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

    private Post mapToPost(PostRequest postRequest) {
        log.info("Mapping post request to post");
        return Post.builder()
                .id(postRequest.getId())
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .authorId(postRequest.getAuthorId())
                .category(postRequest.getCategory())
                .state(postRequest.getState())
                .createdAt(postRequest.getCreatedAt())
                .updatedAt(postRequest.getUpdatedAt())
                .build();
    }

    private PostResponse mapToPostResponse(Post post) {
        log.info("Mapping post to post response");
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

    @Override
    public PostResponse createPost(PostRequest postRequest,String username, int id) {
        if (postRepository.findByTitle(postRequest.getTitle()).isPresent()) {
            throw new TitleAlreadyExistsException("A post with title '" + postRequest.getTitle() + "' already exists.");
        }

        Post post = mapToPost(postRequest);
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(username);
        post.setAuthorId(id);
        post.setCategory(postRequest.getCategory());
        post.setState(postRequest.getState());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("Post created").sender(post.getAuthor()).build();
        notificationClient.sendNotification(notificationRequest);

        log.info("Post created");
        return mapToPostResponse(post);
    }

    @Override
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));
        log.info("Fetching specific post with id {}", id);
        return mapToPostResponse(post);
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        postRepository.delete(post);
        log.info("Deleted post with ID: {}", id);
    }

    @Override
    public PostResponse savePostAsConcept(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        post.setState(State.CONCEPT);
        post.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("Post saved as concept").sender(post.getAuthor()).build();
        notificationClient.sendNotification(notificationRequest);
        log.info("Post saved as concept");
        return mapToPostResponse(savedPost);
    }

    @Override
    public PostResponse updatePost(PostRequest postRequest) {
        if (postRequest.getId() == null) {
            throw new IllegalArgumentException("Cannot update a post without an ID.");
        }

        Post post = postRepository.findById(postRequest.getId())
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + postRequest.getId()));

        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setAuthorId(postRequest.getAuthorId());
        post.setCategory(postRequest.getCategory());
        post.setState(postRequest.getState());
        post.setUpdatedAt(LocalDateTime.now());

        postRepository.save(post);
        log.info("Post updated");
        return mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllConceptPosts() {
        log.info("Fetching all concept posts");
        return postRepository.findAll()
                .stream()
                .filter(p -> p.getState() == State.CONCEPT)
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> getAllPublishedPosts() {
        log.info("Fetching all published posts");
        return postRepository.findAll()
                .stream()
                .filter(p -> p.getState() == State.PUBLISHED)
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> getAllPersonalConceptPosts(Long authorId) {
        log.info("Fetching all my personal concept posts");
        return postRepository.findAll()
                .stream()
                .filter(p -> p.getAuthorId() == authorId && p.getState() == State.CONCEPT)
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<PostResponse> getAllPersonalPublishedPosts(Long authorId) {
        log.info("Fetching all my personal published posts");
        return postRepository.findAll()
                .stream()
                .filter(p -> p.getAuthorId() == authorId && p.getState() == State.PUBLISHED)
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }


}
