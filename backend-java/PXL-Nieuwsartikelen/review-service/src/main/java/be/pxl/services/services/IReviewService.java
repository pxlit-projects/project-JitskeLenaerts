package be.pxl.services.services;

import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;

import java.util.List;

public interface IReviewService {
    void approvePost(Long id);
    void rejectPost(Long id, String reviewer, Long reviewerId, ReviewRequest reviewRequest);
    List<ReviewResponse> getReviewById(Long id);
}
