package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .build();
    }

    @Override
    public PostResponse createPost(PostRequest postRequest) {
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        postRepository.save(post);
        return mapToPostResponse(post);
    }

}
