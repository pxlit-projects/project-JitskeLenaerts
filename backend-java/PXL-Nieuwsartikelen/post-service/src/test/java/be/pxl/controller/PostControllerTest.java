package be.pxl.controller;

import be.pxl.services.controller.PostController;
import be.pxl.services.domain.State;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.services.IPostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PostControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IPostService postService;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private PostController postController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(postController).build();
    }

    @Test
    void testGetPostById() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();
        when(postService.getPostById(1L, "user", 1L)).thenReturn(postResponse);

        mockMvc.perform(get("/api/post/1")
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.content").value("Test Content"));

        verify(postService, times(1)).getPostById(1L, "user", 1L);
    }

    @Test
    void testDeletePost() throws Exception {
        doNothing().when(postService).deletePost(1L, "user", 1L);

        mockMvc.perform(delete("/api/post/1")
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isNoContent());

        verify(postService, times(1)).deletePost(1L, "user", 1L);
    }

    @Test
    void testGetAllPublishedPosts() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Published Post Title")
                .content("Published Post Content")
                .build();

        when(postService.getPublishedPosts()).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Published Post Title"))
                .andExpect(jsonPath("$[0].content").value("Published Post Content"));

        verify(postService, times(1)).getPublishedPosts();
    }

    @Test
    void testCreatePost() throws Exception {
        // Prepare request and response objects
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("New Post Title");
        postRequest.setContent("New Post Content");

        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("New Post Title")
                .content("New Post Content")
                .build();

        // Mock the service method to return the expected response
        when(postService.createPost(postRequest, "user", 1L)).thenReturn(postResponse);

        // Perform the POST request to create the post
        mockMvc.perform(post("/api/post")
                        .contentType("application/json")
                        .content("{\"title\":\"New Post Title\",\"content\":\"New Post Content\"}")
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isCreated()) // Expect HTTP 201
                .andExpect(jsonPath("$.title").value("New Post Title"))
                .andExpect(jsonPath("$.content").value("New Post Content"));

        // Verify that the service method was called once with the correct arguments
        verify(postService, times(1)).createPost(postRequest, "user", 1L);
    }


    @Test
    void testGetPostsByAuthorAndState() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();

        when(postService.getPostsByAuthorIdAndState(1L, State.PUBLISHED, "user")).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post/filter/{state}", State.PUBLISHED)
                        .header("userId", 1L)
                        .header("username", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"))
                .andExpect(jsonPath("$[0].content").value("Test Content"));

        verify(postService, times(1)).getPostsByAuthorIdAndState(1L, State.PUBLISHED, "user");
    }

    @Test
    void testGetAllPosts() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();

        when(postService.getAllPosts()).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"))
                .andExpect(jsonPath("$[0].content").value("Test Content"));

        verify(postService, times(1)).getAllPosts();
    }

    @Test
    void testGetPostsByState() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();

        when(postService.getPostsByState(State.PUBLISHED, "user", 1L)).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post/state/{state}", State.PUBLISHED)
                        .header("userId", 1L)
                        .header("username", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"))
                .andExpect(jsonPath("$[0].content").value("Test Content"));

        verify(postService, times(1)).getPostsByState(State.PUBLISHED, "user", 1L);
    }

    @Test
    void testPublishPost() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();

        when(postService.publishPost(1L, "user", 1L)).thenReturn(postResponse);

        mockMvc.perform(post("/api/post/{id}/publish", 1L)
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.content").value("Test Content"));

        verify(postService, times(1)).publishPost(1L, "user", 1L);
    }

    @Test
    void testSavePostAsConcept() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .content("Test Content")
                .build();

        when(postService.savePostAsConcept(1L, "user", 1L)).thenReturn(postResponse);

        mockMvc.perform(put("/api/post/{id}/concept", 1L)
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.content").value("Test Content"));

        verify(postService, times(1)).savePostAsConcept(1L, "user", 1L);
    }

    @Test
    void testUpdatePost() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Updated Title");
        postRequest.setContent("Updated Content");

        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Updated Title")
                .content("Updated Content")
                .build();

        when(postService.updatePost(any(), eq("user"), eq(1L))).thenReturn(postResponse);

        mockMvc.perform(put("/api/post/{id}", 1L)
                        .contentType("application/json")
                        .content("{\"title\":\"Updated Title\",\"content\":\"Updated Content\"}")
                        .header("username", "user")
                        .header("userId", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.content").value("Updated Content"));

        verify(postService, times(1)).updatePost(any(), eq("user"), eq(1L));
    }
}
