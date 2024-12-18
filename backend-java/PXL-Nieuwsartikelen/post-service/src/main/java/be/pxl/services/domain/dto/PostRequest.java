package be.pxl.services.domain.dto;

import be.pxl.services.domain.State;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private Long id;
    private String title;
    private String content;
    private String author;
    private Long authorId;
    private String category;
    private State state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
