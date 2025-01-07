package be.pxl.controller;

import be.pxl.services.controller.NotificationController;
import be.pxl.services.domain.Notification;
import be.pxl.services.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    @Test
    void testSendMessage() throws Exception {
        // Given a Notification object
        Notification notification = new Notification();
        notification.setMessage("This is a test notification");

        // Perform the POST request to send the message
        mockMvc.perform(post("/notification")
                        .contentType("application/json")
                        .content("{\"message\": \"This is a test notification\"}"))
                .andExpect(status().isCreated());

        // Verify that the sendMessage method in the service was called exactly once
        verify(notificationService, times(1)).sendMessage(eq(notification));
    }
}
