package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
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
public class PostService implements IPostService{
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

    private Post mapToPost(PostRequest postRequest) {
        return Post.builder()
                .id(postRequest.getId())
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .category(postRequest.getCategory())
                .concept(postRequest.getConcept())
                .createdAt(postRequest.getCreatedAt())
                .updatedAt(postRequest.getUpdatedAt())
                .build();
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .category(post.getCategory())
                .concept(post.getConcept())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Override
    public PostResponse createPost(PostRequest postRequest) {
        Post post = mapToPost(postRequest);
        post.setConcept(false);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("Post created").sender(post.getAuthor()).build();
        notificationClient.sendNotification(notificationRequest);

        return mapToPostResponse(post);
    }

    @Override
    public PostResponse savePostAsConcept(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post not found with ID: " + id));

        post.setConcept(true);
        post.setUpdatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("Post saved as concept").sender(post.getAuthor()).build();
        notificationClient.sendNotification(notificationRequest);

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
        post.setCategory(postRequest.getCategory());
        post.setUpdatedAt(LocalDateTime.now());

        postRepository.save(post);

        return mapToPostResponse(post);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponse> filterPosts(String title, String author, String category, LocalDateTime startDate, LocalDateTime endDate) {
        List<Post> filteredPosts;
        if (title != null && !title.isBlank()) {
            filteredPosts = postRepository.findByTitleContainingIgnoreCase(title);
        } else if (author != null && !author.isBlank()) {
            filteredPosts = postRepository.findByAuthorIgnoreCase(author);
        } else if (category != null && !category.isBlank()) {
            filteredPosts = postRepository.findByCategoryIgnoreCase(category);
        } else if (startDate != null && endDate != null) {
            filteredPosts = postRepository.findByCreatedAtBetween(startDate, endDate);
        } else {
            filteredPosts = postRepository.findAll();
        }

        return filteredPosts.stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }
}
