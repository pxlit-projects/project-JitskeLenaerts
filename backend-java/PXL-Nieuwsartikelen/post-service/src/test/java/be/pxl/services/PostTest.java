package be.pxl.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.exception.TitleAlreadyExistsException;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
@Transactional
public class PostTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer<?> sqlContainer =
            new MySQLContainer<>("mysql:8.0.39");

    @Autowired
    private PostService postService;

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @BeforeEach
    public void setUp() {
        postRepository.deleteAll();
    }

    @Test
    public void testCreateEmployee() throws Exception {
        Post post = Post.builder()
                .title("titel")
                .content("content")
                .author("author")
                .category("category")
                .concept(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        String postString = objectMapper.writeValueAsString(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postString))
                .andExpect(status().isCreated());

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testGetAllEmployees() throws Exception {
        Post post = Post.builder()
                .title("titel")
                .content("content")
                .author("author")
                .category("category")
                .concept(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Post post1 = Post.builder()
                .title("titel1")
                .content("content1")
                .author("author1")
                .category("category1")
                .concept(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);
        postRepository.save(post1);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/post")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        assertEquals(2, postRepository.findAll().size());
    }

    @Test
    public void testGetEmployeeById() throws Exception {
        Post post = Post.builder()
                .title("titel1")
                .content("content1")
                .author("author1")
                .category("category1")
                .concept(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(post.getId()))
                .andExpect(jsonPath("$.title").value("titel1"))
                .andExpect(jsonPath("$.content").value("content1"))
                .andExpect(jsonPath("$.author").value("author1"))
                .andExpect(jsonPath("$.category").value("category1"))
                .andExpect(jsonPath("$.concept").value(false));

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = Post.builder()
                .title("titel")
                .content("content")
                .author("author")
                .category("category")
                .concept(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        PostRequest updatedPost = PostRequest.builder()
                .title("updated titel")
                .content("updated content")
                .author("updated author")
                .category("updated category")
                .concept(false)
                .createdAt(post.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        String updatedPostString = objectMapper.writeValueAsString(updatedPost);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedPostString))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(post.getId()))
                .andExpect(jsonPath("$.title").value("updated titel"))
                .andExpect(jsonPath("$.content").value("updated content"))
                .andExpect(jsonPath("$.author").value("updated author"))
                .andExpect(jsonPath("$.category").value("updated category"))
                .andExpect(jsonPath("$.concept").value(false));

        Post savedPost = postRepository.findById(post.getId()).orElse(null);
        assertEquals("updated titel", savedPost.getTitle());
        assertEquals("updated content", savedPost.getContent());
    }
    @Test
    public void testSavePostAsConcept() throws Exception {
        Post post = Post.builder()
                .title("titel")
                .content("content")
                .author("author")
                .category("category")
                .concept(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.put("/api/post/"+post.getId()+"/concept" )
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(post.getId()))
                .andExpect(jsonPath("$.concept").value(true));

        Post updatedPost = postRepository.findById(post.getId()).orElse(null);
        assertEquals(true, updatedPost.getConcept());
    }
    @Test
    public void testDeletePost() throws Exception {
        Post post = Post.builder()
                .title("titel")
                .content("content")
                .author("author")
                .category("category")
                .concept(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/post/" + post.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        assertEquals(0, postRepository.findAll().size());
    }

    @Test
    public void testGetPostByIdNotFound() {
        Exception exception = assertThrows(PostNotFoundException.class, () -> {
            postService.getPostById(999L);
        });
        assertEquals("Post not found with ID: 999", exception.getMessage());
    }
    @Test
    public void testCreatePostWithDuplicateTitle() {
        PostRequest postRequest = PostRequest.builder()
                .title("Duplicate Title")
                .content("Some content")
                .author("Author")
                .category("Category")
                .concept(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        postService.createPost(postRequest);
        Exception exception = assertThrows(TitleAlreadyExistsException.class, () -> {
            postService.createPost(postRequest);
        });
        assertEquals("A post with title 'Duplicate Title' already exists.", exception.getMessage());
    }

    @Test
    public void testUpdatePostIdIsNull() {
        PostRequest postRequest = PostRequest.builder()
                .id(null) // ID is bewust null
                .title("Title")
                .content("content")
                .author("Author")
                .category("Category")
                .concept(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            postService.updatePost(postRequest);
        });

        assertEquals("Cannot update a post without an ID.", exception.getMessage());
    }


}
