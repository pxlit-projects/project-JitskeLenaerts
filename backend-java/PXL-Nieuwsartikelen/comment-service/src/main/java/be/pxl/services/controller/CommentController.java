package be.pxl.services.controller;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.services.ICommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    private static final Logger log = LoggerFactory.getLogger(CommentController.class);
    private final ICommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CommentRequest commentRequest) {
        log.info("Request to create a comment");
        CommentResponse commentResponse = commentService.createComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentResponse);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        log.info("Request to fetch all comments");
        List<CommentResponse> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        log.info("Request to fetch comments for postId: {}", postId);
        List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long id,@Valid @RequestBody CommentRequest commentRequest) {
        log.info("Request to update comment with id: {}", id);
        CommentResponse updatedComment = commentService.updateComment(id, commentRequest);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        log.info("Request to delete comment with id: {}", id);
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
