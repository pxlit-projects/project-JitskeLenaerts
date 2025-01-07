package be.pxl.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.services.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // This will ensure that mocks are properly initialized
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    private CommentRequest commentRequest;

    @BeforeEach
    void setUp() {
        commentRequest = new CommentRequest(1L, "Test comment", "author", 123L);
    }

    @Test
    void getAllComments_shouldReturnListOfComments() {
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

        List<CommentResponse> responses = commentService.getAllComments();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());
        assertEquals(now, responses.get(0).getCreatedAt());
        assertEquals(now, responses.get(0).getUpdatedAt());
        verify(commentRepository).findAll();
    }


    @Test
    void updateComment_shouldUpdateUpdatedAtToNewerTimestamp() {
        LocalDateTime oldUpdatedAt = LocalDateTime.of(2025, 1, 1, 1, 1);
        Comment existingComment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Old comment")
                .createdAt(oldUpdatedAt.minusDays(1))
                .updatedAt(oldUpdatedAt)
                .build();

        CommentRequest updatedRequest = new CommentRequest(1L, "Updated comment", "author", 123L);

        when(commentRepository.findById(1L)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment savedComment = invocation.getArgument(0);
            savedComment.setUpdatedAt(LocalDateTime.now());
            return savedComment;
        });

        CommentResponse response = commentService.updateComment(1L, updatedRequest, "author", 123L);

        existingComment.setUpdatedAt(response.getUpdatedAt());

        assertNotNull(response, "De response mag niet null zijn");
        assertEquals("Updated comment", response.getComment(), "De comment text moet geüpdatet zijn");
        assertTrue(response.getUpdatedAt().isAfter(oldUpdatedAt),
                "De updatedAt timestamp moet nieuwer zijn dan de vorige waarde");

        verify(commentRepository).findById(1L);
        verify(commentRepository).save(existingComment);
    }



    @Test
    void getCommentsByPostId_shouldReturnListOfCommentsForPostId() {
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

        when(commentRepository.findAllByPostId(1L)).thenReturn(List.of(comment));

        List<CommentResponse> responses = commentService.getCommentsByPostId(1L, "author", 123L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(1L, responses.get(0).getId());
        assertEquals(now, responses.get(0).getCreatedAt());
        assertEquals(now, responses.get(0).getUpdatedAt());
        verify(commentRepository).findAllByPostId(1L);
    }

    @Test
    void deleteComment_shouldThrowExceptionIfCommentNotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.deleteComment(1L, "author", 123L);
        });
        assertEquals("Comment with id 1 not found", exception.getMessage());
    }

    @Test
    void updateComment_shouldThrowExceptionIfAuthorMismatch() {
        LocalDateTime now = LocalDateTime.now();
        Comment existingComment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Old comment")
                .createdAt(now)
                .updatedAt(now)
                .build();

        when(commentRepository.findById(1L)).thenReturn(Optional.of(existingComment));

        CommentRequest updatedRequest = new CommentRequest(1L, "Updated comment", "wrongAuthor", 123L);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.updateComment(1L, updatedRequest, "wrongAuthor", 123L);
        });
        assertEquals("Only the original author can update the comment", exception.getMessage());
    }

    @Test
    void createComment_shouldReturnSavedCommentResponse() {
        LocalDateTime now = LocalDateTime.now();
        Comment savedComment = Comment.builder()
                .id(1L)
                .postId(1L)
                .author("author")
                .authorId(123L)
                .comment("Test comment")
                .createdAt(now)
                .updatedAt(now)
                .build();

        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        CommentResponse response = commentService.createComment(commentRequest, "author", 123L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Test comment", response.getComment());
        assertEquals(now, response.getCreatedAt());
        assertEquals(now, response.getUpdatedAt());
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void deleteComment_shouldDeleteIfExists() {
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

        commentService.deleteComment(1L, "author", 123L);

        verify(commentRepository).delete(comment);
    }
}
