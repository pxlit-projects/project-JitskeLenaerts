import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {
  router: Router = inject(Router);
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);

  post!: Post;

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchPost(postId);
  }

  goToEditPage(postId: number) {
    this.router.navigate(['/edit', postId]);
  }

  fetchPost(id: number): void {
    this.postService.getPostById(id).subscribe({
      next: post => {
        this.post = post;
      },
      error: (err) => {
        console.error('Fout bij het ophalen van de post:', err);
      }
    });
  }
}
