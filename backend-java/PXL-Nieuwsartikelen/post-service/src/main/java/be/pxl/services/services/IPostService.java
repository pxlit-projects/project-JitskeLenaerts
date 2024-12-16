package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest,String username, int id);
    PostResponse savePostAsConcept(Long id);
    PostResponse updatePost(PostRequest postRequest);
    List<PostResponse> getAllConceptPosts();
    List<PostResponse> getAllPublishedPosts();
    List<PostResponse> getAllPersonalConceptPosts(Long authorId);
    List<PostResponse> getAllPersonalPublishedPosts(Long authorId);
    PostResponse getPostById(Long id);
    void deletePost(Long id);
}
