import { Component } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { ReviewService } from '../../../shared/services/review.service';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from "../../post/filter/filter.component";
import { Filter } from '../../../shared/models/filter.model';

@Component({
  selector: 'app-submitted-review-check',
  standalone: true,
  imports: [FormsModule, FilterComponent],
  templateUrl: './submitted-review-check.component.html',
  styleUrl: './submitted-review-check.component.css'
})
export class SubmittedReviewCheckComponent {
  posts: Post[] = [];
  user: User | null | undefined;
  rejectingPostId: number | null = null;
  rejectionReason: string = '';
  authorName: string = '';

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.fetchSubmittedPosts();
  }

  handleFilter(filter: Filter) {
      if (this.user != null) {
        this.postService.filterInPostsByState(filter, State.SUBMITTED,this.user.username,this.user.id).subscribe({
          next: posts => {
            this.posts = posts;
          },
          error: err => {
            console.error('Error filtering posts:', err);
          }
        });
      }
    }

  fetchSubmittedPosts(): void {
    this.postService.getPostsByState(State.SUBMITTED, this.user?.username!, this.user?.id!).subscribe({
      next: (response) => {
        this.posts = response;
        this.posts.forEach(post => {
          const author = this.authService.getUserById(post.authorId);
          if (author) {
            post.author = author.authorName;
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch submitted posts:', err);
      },
    });
  }

  approvePost(postId: number): void {
    this.reviewService.approvePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        alert('Post approved successfully!');
      },
      error: (err) => {
        console.error('Failed to approve post:', err);
      },
    });
  }

  showRejectForm(postId: number): void {
    this.rejectingPostId = postId;
    this.rejectionReason = '';
  }

  cancelRejection(): void {
    this.rejectingPostId = null;
    this.rejectionReason = '';
  }

  rejectPost(postId: number): void {
    if (!this.rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const rejectReview = {
      postId: postId,
      reason: this.rejectionReason,
      reviewer: this.user?.authorName,
      reviewerId: this.user?.id,
      createdAt: new Date().toISOString(),
    };

    this.reviewService.rejectPost(postId, this.user?.authorName!, this.user?.id!, rejectReview).subscribe({
      next: () => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.rejectingPostId = null;
        this.rejectionReason = '';
        alert('Post rejected successfully!');
      },
      error: (err) => {
        console.error('Failed to reject post:', err);
      },
    });
  }
}