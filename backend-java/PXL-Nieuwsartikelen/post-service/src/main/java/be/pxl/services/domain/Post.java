package be.pxl.services.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name ="post")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(unique = true,columnDefinition = "LONGTEXT")
    private String title;
    @Size(max = 255, message = "content cannot exceed 255 characters")
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    @Column(unique = true)
    private String author;
    private int authorId;
    @Size(max = 255, message = "category cannot exceed 255 characters")
    @Column(columnDefinition = "LONGTEXT")
    private String category;
    @Enumerated(EnumType.STRING)
    private State state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
