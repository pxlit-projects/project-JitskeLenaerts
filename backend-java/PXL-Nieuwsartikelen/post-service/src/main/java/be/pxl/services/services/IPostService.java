package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IPostService {
    PostResponse createPost(PostRequest postRequest);
    PostResponse savePostAsConcept(Long id);
}
