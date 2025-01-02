package be.pxl.controller;

import be.pxl.services.controller.ReviewController;
import be.pxl.services.domain.dto.RejectReview;
import be.pxl.services.services.IReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private IReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();
    }

    @Test
    void testGetReviewById() throws Exception {
        // Assuming the reviewService.getReviewById method returns some review data
        mockMvc.perform(get("/api/review/{id}", 1L))
                .andExpect(status().isOk());

        // Verify the service call was made with the correct parameter
        verify(reviewService, times(1)).getReviewById(1L);
    }

    @Test
    void testApprovePost() throws Exception {
        mockMvc.perform(post("/api/review/{id}/approve", 1L))
                .andExpect(status().isOk());

        // Verify the service call was made with the correct parameter
        verify(reviewService, times(1)).approvePost(1L);
    }

    @Test
    void testRejectPost() throws Exception {
        RejectReview rejectReview = RejectReview.builder()
                .id(1L)
                .postId(1L)
                .reason("Not good")
                .createdAt(LocalDateTime.now())
                .build();

        // Mock the headers
        mockMvc.perform(post("/api/review/{id}/reject", 1L)
                        .header("reviewer", "JohnDoe")
                        .header("reviewerId", 123L)
                        .contentType("application/json")
                        .content("{\"id\":1,\"postId\":1,\"reason\":\"Not good\",\"createdAt\":\"2025-01-02T00:00:00\"}"))
                .andExpect(status().isOk());

        // Verify the service call was made with the correct parameters
        verify(reviewService, times(1)).rejectPost(anyLong(), any(), anyLong(), any(RejectReview.class));
    }
}
