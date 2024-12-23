package be.pxl.services.domain;

import jakarta.persistence.*;
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
    @Column(unique = true,columnDefinition = "longtext")
    private String title;
    @Column(columnDefinition = "longtext")
    private String content;
    private String author;
    private Long authorId;
    @Column(columnDefinition = "longtext")
    private String category;
    @Enumerated(EnumType.STRING)
    private State state;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
