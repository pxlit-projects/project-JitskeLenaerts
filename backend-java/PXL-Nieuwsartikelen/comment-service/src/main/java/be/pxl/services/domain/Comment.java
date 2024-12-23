package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long postId;
    @Column(columnDefinition = "longtext")
    private String comment;
    private String author;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}