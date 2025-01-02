package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    private final CommentRepository commentRepository = mock(CommentRepository.class);
    private final CommentService commentService = new CommentService(commentRepository);

    @Test
    void createComment_shouldReturnSavedCommentResponse() {
        // Prepare test data
        CommentRequest request = new CommentRequest(1L, "Test comment", "author", 123L);
        LocalDateTime now = LocalDateTime.now();
        Comment comment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Test comment")
                .createdAt(now)
                .updatedAt(now)
                .build();

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        // Perform the test
        CommentResponse response = commentService.createComment(request, "author", 123L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test comment", response.getComment());
        assertEquals(now, response.getCreatedAt());
        assertEquals(now, response.getUpdatedAt());

        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void getAllComments_shouldReturnListOfComments() {
        // Prepare test data
        LocalDateTime now = LocalDateTime.now();
        Comment comment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Test comment")
                .createdAt(now)
                .updatedAt(now)
                .build();
        when(commentRepository.findAll()).thenReturn(List.of(comment));

        // Perform the test
        List<CommentResponse> responses = commentService.getAllComments();

        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());
        assertEquals(now, responses.get(0).getCreatedAt());
        assertEquals(now, responses.get(0).getUpdatedAt());

        verify(commentRepository).findAll();
    }

    @Test
    void updateComment_shouldReturnUpdatedComment() {
        // Prepare test data
        LocalDateTime now = LocalDateTime.now();
        CommentRequest request = new CommentRequest(1L, "Updated comment", "author", 123L);
        Comment comment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Test comment")
                .createdAt(now)
                .updatedAt(now)
                .build();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        // Perform the test
        CommentResponse updatedResponse = commentService.updateComment(1L, request, "author", 123L);

        assertEquals("Updated comment", updatedResponse.getComment());
        assertNotNull(updatedResponse.getUpdatedAt());
        assertNotEquals(now, updatedResponse.getUpdatedAt());

        verify(commentRepository).findById(1L);
        verify(commentRepository).save(comment);
    }

    @Test
    void deleteComment_shouldDeleteIfExists() {
        // Prepare test data
        LocalDateTime now = LocalDateTime.now();
        Comment comment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Test comment")
                .createdAt(now)
                .updatedAt(now)
                .build();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        // Perform the test
        commentService.deleteComment(1L, "author", 123L);

        verify(commentRepository).delete(comment);
    }
}
