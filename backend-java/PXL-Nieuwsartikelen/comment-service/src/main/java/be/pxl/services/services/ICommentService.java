package be.pxl.services.services;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;

import java.util.List;

public interface ICommentService {
    CommentResponse createComment(CommentRequest commentRequest, String username, Long authorId);
    List<CommentResponse> getAllComments();
    List<CommentResponse> getCommentsByPostId(Long postId, String username, Long authorId);
    CommentResponse updateComment(Long id, CommentRequest commentRequest, String username, Long authorId);
    void deleteComment(Long id, String username, Long authorId);
}