package be.pxl.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.domain.dto.RejectReview;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.services.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private PostClient postClient;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReviewService reviewService;

    @Captor
    private ArgumentCaptor<Long> postIdCaptor;

    @Captor
    private ArgumentCaptor<Review> reviewCaptor;

    private final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void testApprovePost() {
        Long postId = 1L;

        // Act
        reviewService.approvePost(postId);

        // Assert: Verify that the method sends the notification and logs the post approval
        verify(rabbitTemplate, times(1)).convertAndSend(eq("postApprovedPostQueue"), postIdCaptor.capture());
        verify(reviewRepository, times(0)).save(any());
    }

    @Test
    void testRejectPost_Success() {
        Long postId = 1L;
        String reviewer = "JohnDoe";
        Long reviewerId = 123L;
        RejectReview rejectReview = RejectReview.builder()
                .id(1L)
                .postId(postId)
                .reason("Not good")
                .createdAt(LocalDateTime.now())
                .build();

        // Mocking the PostClient to return a post
        PostResponse postResponse = PostResponse.builder()
                .id(postId)
                .title("Test Post")
                .author("Author")
                .build();

        when(postClient.getPostById(postId, reviewer, reviewerId)).thenReturn(postResponse);

        // Act
        reviewService.rejectPost(postId, reviewer, reviewerId, rejectReview);

        // Assert: Verify that the rejection logic is triggered, notification sent, and review saved
        verify(rabbitTemplate, times(1)).convertAndSend(eq("postRejectedPostQueue"), postIdCaptor.capture());
        verify(reviewRepository, times(1)).save(reviewCaptor.capture());

        // Assert Review is saved correctly
        Review savedReview = reviewCaptor.getValue();
        assertEquals(postId, savedReview.getPostId());
        assertEquals(rejectReview.getReason(), savedReview.getReason());
        assertEquals(reviewer, savedReview.getReviewer());
        assertEquals(reviewerId, savedReview.getReviewerId());
    }

    @Test
    void testGetReviewById() {
        Long postId = 1L;

        // Prepare mock response
        Review review = Review.builder()
                .postId(postId)
                .reason("Not good")
                .reviewer("JohnDoe")
                .reviewerId(123L)
                .createdAt(LocalDateTime.now())
                .build();

        List<Review> reviews = Collections.singletonList(review);
        when(reviewRepository.findAllByPostId(postId)).thenReturn(reviews);

        // Act
        List<ReviewResponse> reviewResponses = reviewService.getReviewById(postId);

        // Assert: Verify that the reviews are correctly returned
        assertEquals(1, reviewResponses.size());
        ReviewResponse reviewResponse = reviewResponses.get(0);
        assertEquals(postId, reviewResponse.getPostId());
        assertEquals("Not good", reviewResponse.getReason());
        assertEquals("JohnDoe", reviewResponse.getReviewer());
    }
}
