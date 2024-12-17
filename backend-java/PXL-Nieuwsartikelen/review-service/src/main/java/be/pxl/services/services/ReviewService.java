package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);
    private final ReviewRepository reviewRepository;
    private final NotificationClient notificationClient;

    @Override
    public void approvePost(Long id) {

    }
}
