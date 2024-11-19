package be.pxl.services.controller;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity createPost(@RequestBody PostRequest postRequest) {
        return new ResponseEntity(postService.createPost(postRequest), HttpStatus.CREATED);
    }

}
