import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgClass, NgIf } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() showReviewsButton: boolean = false;
  @Input() showPublishButton: boolean = false;
  @Output() viewReviews = new EventEmitter<number>();
  user: User | null | undefined;
  authorName: string = '';

  readonly State = State;

  constructor(private authService: AuthService, private postService: PostService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const author = this.authService.getUserById(this.post.authorId);
    if (author) {
      this.authorName = author.authorName;
    }
  }

  onViewReviews(): void {
    this.viewReviews.emit(this.post.id);
  }

  onPublishButton(): void {
    if (this.user) {
      this.postService.publishPost(this.post.id, this.post, this.user.username, this.user.id).subscribe({
        next: (publishPost) => {
          this.post.state = State.PUBLISHED;
          this.post = publishPost;
          this.router.navigate(['/published/posts']);
        },
        error: (err) => {
          console.error('Failed to update post state:', err);
        }
      });
    }
  }
}
