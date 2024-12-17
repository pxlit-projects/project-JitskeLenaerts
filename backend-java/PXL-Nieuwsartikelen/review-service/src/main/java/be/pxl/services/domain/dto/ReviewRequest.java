package be.pxl.services.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private Long id;
    private Long postId;
    private String review;
    private String reviewer;
    private Long reviewerId;
    private LocalDateTime createdAt;
}
