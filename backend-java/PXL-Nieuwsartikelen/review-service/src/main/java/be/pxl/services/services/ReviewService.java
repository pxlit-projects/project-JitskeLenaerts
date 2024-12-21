package be.pxl.services.services;

import be.pxl.services.client.PostClient;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.domain.dto.RejectReview;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final PostClient postClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .postId(review.getPostId())
                .createdAt(review.getCreatedAt())
                .reason(review.getReason())
                .reviewer(review.getReviewer())
                .reviewerId(review.getReviewerId())
                .build();
    }

    @Override
    public void approvePost(Long postId) {
        rabbitTemplate.convertAndSend("postApprovedPostQueue", postId);
        log.info("Post with ID {} approved.", postId);
    }

    @Override
    public void rejectPost(Long postId, String reviewer, Long reviewerId, RejectReview rejectReview) {
        PostResponse post = postClient.getPostById(postId);

        rabbitTemplate.convertAndSend("postRejectedPostQueue", postId);
        log.info("Post with ID {} rejected by reviewer {} (ID {}).", postId, reviewer, reviewerId);

        Review review = Review.builder()
                .postId(post.getId())
                .createdAt(LocalDateTime.now())
                .reason(rejectReview.getReason())
                .reviewer(reviewer)
                .reviewerId(reviewerId)
                .build();

        reviewRepository.save(review);
        log.info("Review for post ID {} saved to repository.", postId);
    }

    public List<ReviewResponse> getReviewById(Long postId) {
        List<Review> reviews = reviewRepository.findAllByPostId(postId);
        log.info("Retrieved {} reviews for post ID {}.", reviews.size(), postId);

        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }
}
