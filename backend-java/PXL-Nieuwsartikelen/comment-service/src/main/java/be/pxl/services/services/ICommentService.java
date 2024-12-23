package be.pxl.services.services;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;

import java.util.List;

public interface ICommentService {
    CommentResponse createComment(CommentRequest commentRequest);
    List<CommentResponse> getAllComments();
    List<CommentResponse> getCommentsByPostId(Long postId);
    CommentResponse updateComment(Long id, CommentRequest commentRequest);
    void deleteComment(Long id);
}