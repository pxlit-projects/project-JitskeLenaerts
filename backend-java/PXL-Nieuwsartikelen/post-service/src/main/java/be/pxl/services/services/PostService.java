package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .category(post.getCategory())
                .concept(post.getConcept())
                .build();
    }

    public PostResponse createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setCategory(postRequest.getCategory());
        post.setConcept(false);

        postRepository.save(post);

        NotificationRequest notificationRequest = NotificationRequest.builder().message("Post created").sender(post.getAuthor()).build();
        notificationClient.sendNotification(notificationRequest);

        return mapToPostResponse(post);
    }

    public PostResponse saveConceptOfPost(Post existingPost, PostRequest postRequest) {
        existingPost.setTitle(postRequest.getTitle());
        existingPost.setContent(postRequest.getContent());
        existingPost.setAuthor(postRequest.getAuthor());
        existingPost.setCategory(postRequest.getCategory());
        existingPost.setConcept(true);

        System.out.println("------");
        System.out.println(existingPost);
        System.out.println(postRequest);
        postRepository.save(existingPost);
        System.out.println("------");

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .message("Saved post")
                .sender(existingPost.getAuthor())
                .build();

        notificationClient.sendNotification(notificationRequest);

        return mapToPostResponse(existingPost);
    }




}
