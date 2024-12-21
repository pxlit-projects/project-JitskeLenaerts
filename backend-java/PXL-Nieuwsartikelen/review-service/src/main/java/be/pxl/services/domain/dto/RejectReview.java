package be.pxl.services.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RejectReview {
    private Long id;
    private Long postId;
    private String reason;
    private LocalDateTime createdAt;
}