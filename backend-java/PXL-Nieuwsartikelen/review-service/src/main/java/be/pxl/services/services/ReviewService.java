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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final PostClient postClient;
    private final RabbitTemplate rabbitTemplate;

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
        sendNotificationToQueue("postApprovedPostQueue", postId);
        logPostStatusChange(postId, "approved");
    }

    @Override
    public void rejectPost(Long postId, String reviewer, Long reviewerId, RejectReview rejectReview) {
        Optional<PostResponse> post = Optional.ofNullable(postClient.getPostById(postId));

        if (post.isEmpty()) {
            log.error("Post with ID {} not found.", postId);
            return;
        }

        sendNotificationToQueue("postRejectedPostQueue", postId);
        logPostStatusChange(postId, "rejected", reviewer, reviewerId);

        saveReview(post.get(), rejectReview, reviewer, reviewerId);
    }

    private void sendNotificationToQueue(String queueName, Long postId) {
        rabbitTemplate.convertAndSend(queueName, postId);
        log.info("Notification sent for post ID {} to queue {}.", postId, queueName);
    }

    private void logPostStatusChange(Long postId, String status) {
        log.info("Post with ID {} has been {}.", postId, status);
    }

    private void logPostStatusChange(Long postId, String status, String reviewer, Long reviewerId) {
        log.info("Post with ID {} has been {} by reviewer {} (ID {}).", postId, status, reviewer, reviewerId);
    }

    private void saveReview(PostResponse post, RejectReview rejectReview, String reviewer, Long reviewerId) {
        Review review = buildReview(post, rejectReview, reviewer, reviewerId);
        reviewRepository.save(review);
        log.info("Review for post ID {} saved to repository.", post.getId());
    }

    private Review buildReview(PostResponse post, RejectReview rejectReview, String reviewer, Long reviewerId) {
        return Review.builder()
                .postId(post.getId())
                .createdAt(LocalDateTime.now())
                .reason(rejectReview.getReason())
                .reviewer(reviewer)
                .reviewerId(reviewerId)
                .build();
    }

    @Override
    public List<ReviewResponse> getReviewById(Long postId) {
        List<Review> reviews = reviewRepository.findAllByPostId(postId);
        log.info("Retrieved {} reviews for post ID {}.", reviews.size(), postId);

        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }
}
