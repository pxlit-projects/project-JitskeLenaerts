package be.pxl.controller;

import be.pxl.services.controller.CommentController;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.services.ICommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CommentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ICommentService commentService;

    @InjectMocks
    private CommentController commentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(commentController).build();
    }

    @Test
    void testCreateComment() throws Exception {
        CommentRequest commentRequest = new CommentRequest(1L, "Updated comment", "author", 123L);
        CommentResponse commentResponse = new CommentResponse(1L, 1L, "Updated comment", "author", 123L, null, null); // Make sure the 'comment' field is set correctly

        when(commentService.createComment(eq(commentRequest), eq("author"), eq(123L))).thenReturn(commentResponse);

        mockMvc.perform(post("/api/comment")
                        .contentType("application/json")
                        .content("{\"postId\": 1, \"comment\": \"Updated comment\", \"author\": \"author\", \"authorId\": 123}")
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.comment").value("Updated comment"))
                .andExpect(jsonPath("$.author").value("author"));

        verify(commentService, times(1)).createComment(eq(commentRequest), eq("author"), eq(123L));
    }

    @Test
    void testGetAllComments() throws Exception {
        CommentResponse commentResponse = new CommentResponse(1L, 1L, "Updated comment","author", 123L,  null, null);
        when(commentService.getAllComments()).thenReturn(List.of(commentResponse));

        mockMvc.perform(get("/api/comment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].comment").value("Updated comment"))
                .andExpect(jsonPath("$[0].author").value("author"));

        verify(commentService, times(1)).getAllComments();
    }

    @Test
    void testGetCommentsByPostId() throws Exception {
        CommentResponse commentResponse = new CommentResponse(1L, 1L, "Updated comment","author", 123L,  null, null);
        when(commentService.getCommentsByPostId(1L, "author", 123L)).thenReturn(List.of(commentResponse));

        mockMvc.perform(get("/api/comment/{postId}", 1L)
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].comment").value("Updated comment"))
                .andExpect(jsonPath("$[0].author").value("author"));

        verify(commentService, times(1)).getCommentsByPostId(1L, "author", 123L);
    }

    @Test
    void testUpdateComment() throws Exception {
        CommentRequest commentRequest = new CommentRequest(1L, "Updated comment", "author", 123L);
        CommentResponse commentResponse = new CommentResponse(1L, 1L, "Updated comment", "author", 123L, null, null);

        when(commentService.updateComment(eq(1L), eq(commentRequest), eq("author"), eq(123L))).thenReturn(commentResponse);

        mockMvc.perform(patch("/api/comment/{id}", 1L)
                        .contentType("application/json")
                        .content("{\"postId\": 1, \"comment\": \"Updated comment\", \"author\": \"author\", \"authorId\": 123}")
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comment").value("Updated comment"))
                .andExpect(jsonPath("$.author").value("author"))
                .andExpect(jsonPath("$.postId").value(1L))
                .andExpect(jsonPath("$.authorId").value(123L));

        verify(commentService, times(1)).updateComment(eq(1L), eq(commentRequest), eq("author"), eq(123L));
    }


    @Test
    void testDeleteComment() throws Exception {
        // Mocking service method to delete a comment
        doNothing().when(commentService).deleteComment(1L, "author", 123L);

        // Perform the DELETE request
        mockMvc.perform(delete("/api/comment/{id}", 1L)
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isNoContent());

        // Verify the service was called
        verify(commentService, times(1)).deleteComment(1L, "author", 123L);
    }
}
