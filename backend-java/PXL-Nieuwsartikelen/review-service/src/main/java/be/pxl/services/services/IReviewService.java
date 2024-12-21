package be.pxl.services.services;

import be.pxl.services.domain.dto.RejectReview;
import be.pxl.services.domain.dto.ReviewResponse;

import java.util.List;

public interface IReviewService {
    void approvePost(Long id);
    void rejectPost(Long id, String reviewer, Long reviewerId, RejectReview rejectReview);
    List<ReviewResponse> getReviewById(Long id);
}
