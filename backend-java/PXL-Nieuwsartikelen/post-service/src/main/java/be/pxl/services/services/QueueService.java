package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.State;
import be.pxl.services.exception.PostNotFoundException;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QueueService {
    private final PostRepository postRepository;
    private final MailSenderService mailSenderService;

    @RabbitListener(queues = "postApprovedPostQueue")
    public void approvedPost(Long id){
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
        post.setState(State.APPROVED);
        postRepository.save(post);
        mailSenderService.sendNotificationMail("Blog \"" + post.getTitle() + "\" approved", "The blog with title \"" + post.getTitle() + "\" has been approved and is ready to be published.");
    }

    @RabbitListener(queues = "postRejectedPostQueue")
    public void rejectedPost(Long id){
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
        post.setState(State.REJECTED);
        postRepository.save(post);
        mailSenderService.sendNotificationMail("Blog \"" + post.getTitle() + "\" rejected", "The blog with title  \"" + post.getTitle() + "\" has been rejected and needs to be rewritten before being resubmitted.");
    }
}
