import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { PostService } from '../../../shared/services/post.service';
import { ReviewService } from '../../../shared/services/review.service';
import { Review } from '../../../shared/models/review.model';
import { PostItemComponent } from "../post-item/post-item.component";
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { FilterComponent } from "../filter/filter.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list-rejected',
  standalone: true,
  imports: [PostItemComponent, FilterComponent,CommonModule],
  templateUrl: './post-list-rejected.component.html',
  styleUrl: './post-list-rejected.component.css'
})
export class PostListRejectedComponent implements OnInit {
  rejectedPosts: Post[] = [];
  reviews: Review[] = [];
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  userRole: string | null = null;

  constructor(private postService: PostService, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.authService.getCurrentUserRole();
    this.loadRejectedPosts();
  }

  loadRejectedPosts(): void {
    if (this.user) {
      this.postService.getPostsByState(State.REJECTED, this.user.username, this.user.id).subscribe({
        next: (posts: Post[]) => {
          this.rejectedPosts = posts;
        },
        error: (error) => {
          console.error('Error fetching approved posts:', error);
        }
      });
    } else {
      console.error('No user found.');
    }
  }

  handleFilter(filter: Filter) {
    if (this.user != null) {
      this.postService.filterInPostsByState(filter, State.REJECTED, this.user.username, this.user.id).subscribe({
        next: posts => {
          this.rejectedPosts = posts;
        },
        error: err => {
          console.error('Error filtering posts:', err);
        }
      });
    }
  }

  getReviewsForPost(postId: number): void {
    this.reviews = [];
    if (postId !== undefined) {
      this.reviewService.getReviewsForPost(postId).subscribe({
        next: (reviews: Review[]) => {
          this.reviews = reviews;
        },
        error: (error) => {
          console.error('Error fetching reviews for post:', error);
        }
      });
    } else {
      console.warn('Post ID is undefined');
    }
  }
}
