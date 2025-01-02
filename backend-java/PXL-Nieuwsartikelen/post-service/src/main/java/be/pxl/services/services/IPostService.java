package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest,String username, Long userId);
    PostResponse savePostAsConcept(Long id,String username, Long userId);
    PostResponse updatePost(PostRequest postRequest,String username, Long userId);
    List<PostResponse> getPostsByAuthorIdAndState(Long userId, State state, String username);
    List<PostResponse> getAllPosts();
    List<PostResponse> getPublishedPosts();
    List<PostResponse> getPostsByState(State state,String username, Long userId);
    PostResponse publishPost(Long id,String username, Long userId);
    PostResponse getPostById(Long id,String username, Long userId);
    void deletePost(Long id,String username, Long userId);
}
