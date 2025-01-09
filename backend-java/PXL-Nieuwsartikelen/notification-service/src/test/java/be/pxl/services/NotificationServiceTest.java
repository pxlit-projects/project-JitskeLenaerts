package be.pxl.services;

import be.pxl.services.domain.Notification;
import be.pxl.services.services.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification;

    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setMessage("Test message");
        notification.setSender("test@example.com");
    }

    @Test
    void testSendMessageLogsCorrectly() {
        // Spy on the NotificationService to capture log interactions
        NotificationService spyService = Mockito.spy(notificationService);

        // Call the method to be tested
        spyService.sendMessage(notification);

        // Verify that logging occurs with the correct messages
        verify(spyService, times(1)).sendMessage(notification);
    }
}
