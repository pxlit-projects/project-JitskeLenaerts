import { Component, inject, OnInit } from '@angular/core';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { PostItemComponent } from "../post-item/post-item.component";
import { FilterComponent } from "../filter/filter.component";
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { State } from '../../../shared/models/state.enum';

@Component({
  selector: 'app-post-list-published',
  standalone: true,
  imports: [PostItemComponent, FilterComponent],
  templateUrl: './post-list-published.component.html',
  styleUrl: './post-list-published.component.css'
})
export class PostListPublishedComponent implements OnInit {
  publishedPosts!: Post[];
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  userRole: string | null = null;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getCurrentUserRole();
    this.fetchData();
  }

  handleFilter(filter: Filter) {
    if (this.userRole === 'redacteur' || this.userRole === 'gebruiker') {
      this.postService.filterInPublishedPosts(filter).subscribe({
        next: posts => {
          this.publishedPosts = posts;
        },
        error: err => {
          console.error('Error filtering posts:', err);
        }
      });
    }
  }

  fetchData(): void {
    if (this.userRole === 'redacteur') {
      this.postService.getPublishedPosts().subscribe({
        next: posts => {
          this.publishedPosts = posts.filter(post => post.state === State.PUBLISHED);
        },
        error: err => {
          console.error('Error fetching published posts:', err);
        }
      });
    } else {
      this.user = this.authService.getCurrentUser();
      if (this.user) {
        this.postService.getPersonalPublishedPosts(this.user.id).subscribe({
          next: posts => {
            this.publishedPosts = posts.filter(post => post.state === State.PUBLISHED);
          },
          error: err => {
            console.error('Error fetching personal published posts:', err);
          }
        });
      }
    }
  }
}