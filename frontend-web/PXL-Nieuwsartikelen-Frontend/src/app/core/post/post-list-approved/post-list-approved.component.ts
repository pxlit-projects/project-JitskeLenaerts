import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { PostService } from '../../../shared/services/post.service';
import { NgFor, NgIf } from '@angular/common';
import { PostItemComponent } from "../post-item/post-item.component";
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { FilterComponent } from "../filter/filter.component";

@Component({
  selector: 'app-post-list-approved',
  standalone: true,
  imports: [NgIf, NgFor, PostItemComponent, FilterComponent],
  templateUrl: './post-list-approved.component.html',
  styleUrl: './post-list-approved.component.css'
})
export class PostListApprovedComponent implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = false;
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  userRole: string | null = null;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getCurrentUserRole();
    this.loadApprovedPosts();
  }
  handleFilter(filter: Filter) {
    if (this.userRole === 'redacteur' || this.userRole === 'gebruiker') {
      this.postService.filterInPostsByState(filter, State.APPROVED).subscribe({
        next: posts => {
          this.posts = posts;
        },
        error: err => {
          console.error('Error filtering posts:', err);
        }
      });
    }
  }

  loadApprovedPosts(): void {
    this.isLoading = true;
    this.postService.getPostsByState(State.PUBLISHED).subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching approved posts:', error);
        this.isLoading = false;
      }
    });


  }
}
