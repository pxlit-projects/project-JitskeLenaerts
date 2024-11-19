package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .category(post.getCategory())
                .build();
    }

    public PostResponse createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setCategory(postRequest.getCategory());
        postRepository.save(post);
        NotificationRequest notificationRequest = NotificationRequest.builder().message("Employee Created").sender("Tom").build();
        notificationClient.sendNotification(notificationRequest);
        return mapToPostResponse(post);
    }


}
