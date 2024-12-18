import { Component, inject, OnInit } from '@angular/core';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { FilterComponent } from "../filter/filter.component";
import { PostItemComponent } from "../post-item/post-item.component";
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { State } from '../../../shared/models/state.enum';

@Component({
  selector: 'app-post-list-concept',
  standalone: true,
  imports: [FilterComponent, PostItemComponent],
  templateUrl: './post-list-concept.component.html',
  styleUrl: './post-list-concept.component.css'
})
export class PostListConceptComponent implements OnInit {
  filteredData!: Post[];
  conceptPosts!: Post[];
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
      this.postService.filterInPosts(filter).subscribe({
        next: posts => {
          this.conceptPosts = posts;
        },
        error: err => {
          console.error('Error filtering posts:', err);
        }
      });
    }
  }

  fetchData(): void {
    const state = State.CONCEPT;

    if (this.userRole === 'redacteur') {
      this.postService.getPostsByAuthorIdAndState(0, state).subscribe({
        next: posts => {
          this.conceptPosts = posts;
        },
        error: err => {
          console.error('Error fetching concept posts for editor:', err);
        }
      });
    } else {
      this.user = this.authService.getCurrentUser();
      if (this.user) {
        this.postService.getPostsByAuthorIdAndState(this.user.id, state).subscribe({
          next: posts => {
            this.conceptPosts = posts;
          },
          error: err => {
            console.error('Error fetching personal concept posts:', err);
          }
        });
      }
    }
  }
}
