package be.pxl.services.controller;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.services.ICommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ICommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createComment_shouldReturnCreatedResponse() throws Exception {
        // Prepare test data
        CommentRequest request = new CommentRequest(1L, "Test comment", "author", 123L);
        LocalDateTime now = LocalDateTime.now();
        CommentResponse response = new CommentResponse(1L, 1L, "Test comment", "author", 123L, now, now);

        // Mock the service behavior
        when(commentService.createComment(any(CommentRequest.class), anyString(), anyLong())).thenReturn(response);

        // Perform the test
        mockMvc.perform(post("/api/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "author")
                        .header("userId", 123L)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(response.getId()))
                .andExpect(jsonPath("$.comment").value(response.getComment()))
                .andExpect(jsonPath("$.createdAt").value(response.getCreatedAt().toString()))
                .andExpect(jsonPath("$.updatedAt").value(response.getUpdatedAt().toString()));

        verify(commentService).createComment(any(CommentRequest.class), eq("author"), eq(123L));
    }

    @Test
    void getAllComments_shouldReturnListOfComments() throws Exception {
        // Prepare test data
        LocalDateTime now = LocalDateTime.now();
        CommentResponse response = new CommentResponse(1L, 1L, "Test comment", "author", 123L, now, now);

        // Mock the service behavior
        when(commentService.getAllComments()).thenReturn(List.of(response));

        // Perform the test
        mockMvc.perform(get("/api/comment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(response.getId()))
                .andExpect(jsonPath("$[0].createdAt").value(response.getCreatedAt().toString()))
                .andExpect(jsonPath("$[0].updatedAt").value(response.getUpdatedAt().toString()));

        verify(commentService).getAllComments();
    }

    @Test
    void getCommentsByPostId_shouldReturnComments() throws Exception {
        // Prepare test data
        LocalDateTime now = LocalDateTime.now();
        CommentResponse response = new CommentResponse(1L, 1L, "Test comment", "author", 123L, now, now);
        when(commentService.getCommentsByPostId(eq(1L), anyString(), anyLong())).thenReturn(List.of(response));

        // Perform the test
        mockMvc.perform(get("/api/comment/1")
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(response.getId()))
                .andExpect(jsonPath("$[0].createdAt").value(response.getCreatedAt().toString()))
                .andExpect(jsonPath("$[0].updatedAt").value(response.getUpdatedAt().toString()));

        verify(commentService).getCommentsByPostId(1L, "author", 123L);
    }

    @Test
    void updateComment_shouldReturnUpdatedComment() throws Exception {
        // Prepare test data
        CommentRequest request = new CommentRequest(1L, "Updated comment", "author", 123L);
        LocalDateTime now = LocalDateTime.now();
        CommentResponse response = new CommentResponse(1L, 1L, "Updated comment", "author", 123L, now, now);

        // Mock the service behavior
        when(commentService.updateComment(eq(1L), any(CommentRequest.class), anyString(), anyLong())).thenReturn(response);

        // Perform the test
        mockMvc.perform(patch("/api/comment/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "author")
                        .header("userId", 123L)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(response.getId()))
                .andExpect(jsonPath("$.comment").value(response.getComment()))
                .andExpect(jsonPath("$.createdAt").value(response.getCreatedAt().toString()))
                .andExpect(jsonPath("$.updatedAt").value(response.getUpdatedAt().toString()));

        verify(commentService).updateComment(eq(1L), any(CommentRequest.class), eq("author"), eq(123L));
    }

    @Test
    void deleteComment_shouldReturnNoContent() throws Exception {
        // Mock the service behavior
        doNothing().when(commentService).deleteComment(eq(1L), anyString(), anyLong());

        // Perform the test
        mockMvc.perform(delete("/api/comment/1")
                        .header("username", "author")
                        .header("userId", 123L))
                .andExpect(status().isNoContent());

        verify(commentService).deleteComment(1L, "author", 123L);
    }
}
