package be.pxl.services.controller;

import be.pxl.services.domain.dto.RejectReview;
import be.pxl.services.services.IReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewController.class);

    private final IReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Long id) {
        LOGGER.info("Fetching reviews for post ID {}.", id);
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable Long id) {
        reviewService.approvePost(id);
        LOGGER.info("Post ID {} approved.", id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(
            @PathVariable Long id,
            @RequestHeader String reviewer,
            @RequestHeader Long reviewerId,
            @RequestBody RejectReview rejectReview) {
        reviewService.rejectPost(id, reviewer, reviewerId, rejectReview);
        LOGGER.info("Post ID {} rejected by reviewer {} (ID {}).", id, reviewer, reviewerId);
        return ResponseEntity.ok().build();
    }

}
