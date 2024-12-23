package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);
    private final CommentRepository commentRepository;

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .author(comment.getAuthor())
                .authorId(comment.getAuthorId())
                .comment(comment.getComment())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private Comment mapToEntity(CommentRequest commentRequest) {
        return Comment.builder()
                .postId(commentRequest.getPostId())
                .author(commentRequest.getAuthor())
                .authorId(commentRequest.getAuthorId())
                .comment(commentRequest.getComment())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public CommentResponse createComment(CommentRequest commentRequest) {
        log.info("Creating a new comment for postId: {}", commentRequest.getPostId());
        Comment comment = mapToEntity(commentRequest);
        Comment savedComment = commentRepository.save(comment);
        log.info("Comment created with id: {}", savedComment.getId());
        return mapToResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getAllComments() {
        log.info("Fetching all comments");
        return commentRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        log.info("Fetching comments for postId: {}", postId);
        return commentRepository.findAllByPostId(postId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long id, CommentRequest commentRequest) {
        log.info("Updating comment with id: {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " not found"));
        if (!comment.getAuthor().equals(commentRequest.getAuthor())) {
            log.warn("Author mismatch for comment update. id: {}", id);
            throw new IllegalArgumentException("Only the original author can update the comment");
        }
        comment.setComment(commentRequest.getComment());
        comment.setUpdatedAt(LocalDateTime.now());
        Comment updatedComment = commentRepository.save(comment);
        log.info("Comment with id {} updated successfully", id);
        return mapToResponse(updatedComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long id) {
        log.info("Deleting comment with id: {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " not found"));
        commentRepository.delete(comment);
        log.info("Comment with id {} deleted successfully", id);
    }
}
