import { PostService } from './../../../shared/services/post.service';
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';

@Component({
  selector: 'app-editor-review-component',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './editor-review-component.component.html',
  styleUrl: './editor-review-component.component.css'
})
export class EditorReviewComponentComponent {
  posts: Post[] = [];
  isLoading: boolean = true;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchSubmittedPosts();
  }

  fetchSubmittedPosts(): void {
    this.isLoading = true;
    this.postService.getPostsByState(State.SUBMITTED).subscribe({
      next: (response) => {
        this.posts = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch submitted posts:', err);
        this.isLoading = false;
      }
    });
  }

  approvePost(postId: number): void {
    this.postService.approvePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        alert('Post approved successfully!');
      },
      error: (err) => console.error('Failed to approve post:', err)
    });
  }

  rejectPost(postId: number): void {
    this.postService.rejectPost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        alert('Post rejected successfully!');
      },
      error: (err) => console.error('Failed to reject post:', err)
    });
  }
}

