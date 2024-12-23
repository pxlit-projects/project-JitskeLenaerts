import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { State } from '../../../shared/models/state.enum';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  router: Router = inject(Router);
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  post!: Post;
  authorName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id')!);
    this.fetchPost(postId);
  }

  fetchPost(id: number): void {
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        const author = this.authService.getUserById(post.authorId);
        if (author) {
          this.authorName = author.authorName;
        }
      },
      error: (err) => {
        console.error('Fout bij het ophalen van de post:', err);
      },
    });
  }

  goToEditPage(postId: number): void {
    this.router.navigate(['/edit', postId]);
  }

  getStateClass(state: string): string {
    switch (state) {
      case State.CONCEPT:
        return 'state-concept';
      case State.SUBMITTED:
        return 'state-submitted';
      case State.REJECTED:
        return 'state-rejected';
      case State.APPROVED:
        return 'state-approved';
      case State.PUBLISHED:
        return 'state-published';
      default:
        return '';
    }
  }

  getStateLabel(state: string): string {
    switch (state) {
      case State.CONCEPT:
        return 'Concept';
      case State.SUBMITTED:
        return 'Submitted';
      case State.REJECTED:
        return 'Rejected';
      case State.APPROVED:
        return 'Approved';
      case State.PUBLISHED:
        return 'Published';
      default:
        return 'Unknown State';
    }
  }
}
