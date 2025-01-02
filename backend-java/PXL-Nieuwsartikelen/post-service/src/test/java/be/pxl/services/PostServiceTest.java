package be.pxl.services;

import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.exception.TitleAlreadyExistsException;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.client.NotificationClient;
import be.pxl.services.services.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceTest {

    @InjectMocks
    private PostService postService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private NotificationClient notificationClient;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
// --- Tests for existing methods ---

    @Test
    void testGetPostsByAuthorIdAndState() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findPostsByAuthorIdAndState(1L, State.PUBLISHED)).thenReturn(List.of(post));

        List<PostResponse> posts = postService.getPostsByAuthorIdAndState(1L, State.PUBLISHED, "Author");

        assertNotNull(posts);
        assertEquals(1, posts.size());
        assertEquals("Title", posts.get(0).getTitle());
    }

    @Test
    void testGetAllPosts() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findAll()).thenReturn(List.of(post));

        List<PostResponse> posts = postService.getAllPosts();

        assertNotNull(posts);
        assertEquals(1, posts.size());
        assertEquals("Title", posts.get(0).getTitle());
    }

    @Test
    void testGetPublishedPosts() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findPostsByState(State.PUBLISHED)).thenReturn(List.of(post));

        List<PostResponse> posts = postService.getPublishedPosts();

        assertNotNull(posts);
        assertEquals(1, posts.size());
        assertEquals("Title", posts.get(0).getTitle());
    }

    @Test
    void testGetPostsByState() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findPostsByState(State.PUBLISHED)).thenReturn(List.of(post));

        List<PostResponse> posts = postService.getPostsByState(State.PUBLISHED, "Author", 1L);

        assertNotNull(posts);
        assertEquals(1, posts.size());
        assertEquals("Title", posts.get(0).getTitle());
    }

    // --- Tests for new methods ---

    @Test
    void testDeletePost() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        postService.deletePost(1L, "Author", 1L);

        verify(postRepository, times(1)).delete(post);
    }

    @Test
    void testDeletePostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.deletePost(1L, "Author", 1L));
    }

    @Test
    void testSavePostAsConcept() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.CONCEPT).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        // Create a NotificationRequest with the correct data
        NotificationRequest notificationRequest = new NotificationRequest("Post saved as concept", "Author"); // Assuming the constructor is like this

        // Call the method
        PostResponse postResponse = postService.savePostAsConcept(1L, "Author", 1L);

        // Assert the response
        assertNotNull(postResponse);
        assertEquals(State.CONCEPT, postResponse.getState());

        // Verify that the notificationClient.sendNotification() method is called with the NotificationRequest
        verify(notificationClient, times(1)).sendNotification(eq(notificationRequest));
    }


    @Test
    void testSavePostAsConceptNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.savePostAsConcept(1L, "Author", 1L));
    }

    @Test
    void testUpdatePost() {
        PostRequest postRequest = new PostRequest(1L, "Updated Title", "Updated Content", "Author", 1L, "Category", State.PUBLISHED, LocalDateTime.now(), LocalDateTime.now());
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.PUBLISHED).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse postResponse = postService.updatePost(postRequest, "Author", 1L);

        assertNotNull(postResponse);
        assertEquals("Updated Title", postResponse.getTitle());
        assertEquals("Updated Content", postResponse.getContent());
    }

    @Test
    void testUpdatePostNotFound() {
        PostRequest postRequest = new PostRequest(1L, "Updated Title", "Updated Content", "Author", 1L, "Category", State.PUBLISHED, LocalDateTime.now(), LocalDateTime.now());

        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.updatePost(postRequest, "Author", 1L));
    }

    @Test
    void testPublishPost() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.APPROVED).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse postResponse = postService.publishPost(1L, "Author", 1L);

        assertNotNull(postResponse);
        assertEquals(State.PUBLISHED, postResponse.getState());
    }

    @Test
    void testPublishPostNotApproved() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.CONCEPT).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        assertThrows(IllegalArgumentException.class, () -> postService.publishPost(1L, "Author", 1L));
    }

    @Test
    void testCreatePost() {
        PostRequest postRequest = new PostRequest(1L, "Title", "Content", "Author", 1L, "Category", State.CONCEPT, LocalDateTime.now(), LocalDateTime.now());

        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.CONCEPT).build();
        when(postRepository.findByTitle(anyString())).thenReturn(Optional.empty());
        when(postRepository.save(any(Post.class))).thenReturn(post);

        PostResponse postResponse = postService.createPost(postRequest, "Author", 1L);

        assertNotNull(postResponse);
        assertEquals(postResponse.getTitle(), "Title");
        verify(notificationClient, times(1)).sendNotification(any());
    }

    @Test
    void testCreatePostWithDuplicateTitle() {
        PostRequest postRequest = new PostRequest(1L, "Title", "Content", "Author", 1L, "Category", State.CONCEPT, LocalDateTime.now(), LocalDateTime.now());

        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.CONCEPT).build();
        when(postRepository.findByTitle(anyString())).thenReturn(Optional.of(post));

        assertThrows(TitleAlreadyExistsException.class, () -> postService.createPost(postRequest, "Author", 1L));
    }

    @Test
    void testGetPostById() {
        Post post = Post.builder().id(1L).title("Title").content("Content").author("Author").state(State.CONCEPT).build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostResponse postResponse = postService.getPostById(1L, "Author", 1L);

        assertNotNull(postResponse);
        assertEquals(postResponse.getId(), 1L);
    }

    @Test
    void testGetPostByIdNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> postService.getPostById(1L, "Author", 1L));
    }
}
