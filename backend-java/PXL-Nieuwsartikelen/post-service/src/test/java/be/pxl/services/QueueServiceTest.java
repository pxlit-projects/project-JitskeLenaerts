package be.pxl.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.MailSenderService;
import be.pxl.services.services.QueueService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

class QueueServiceTest {

    @InjectMocks
    private QueueService queueService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private MailSenderService mailSenderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testApprovedPost() {
        Post post = new Post(1L, "Test Title", "Content", "Author", 1L, "Category", State.SUBMITTED, null, null);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        queueService.approvedPost(1L);

        assertEquals(State.APPROVED, post.getState());
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNotificationMail(anyString(), anyString());
    }

    @Test
    void testRejectedPost() {
        Post post = new Post(1L, "Test Title", "Content", "Author", 1L, "Category", State.SUBMITTED, null, null);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        queueService.rejectedPost(1L);

        assertEquals(State.REJECTED, post.getState());
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNotificationMail(anyString(), anyString());
    }

    @Test
    void testPostNotFoundForQueue() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> queueService.approvedPost(1L));
    }
}
