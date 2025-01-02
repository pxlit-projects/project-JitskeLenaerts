import { Component, inject } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';
import { PostItemComponent } from '../post-item/post-item.component';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-post-list-submitted',
  standalone: true,
  imports: [PostItemComponent, FilterComponent],
  templateUrl: './post-list-submitted.component.html',
  styleUrl: './post-list-submitted.component.css'
})
export class PostListSubmittedComponent {
  submittedPosts!: Post[];
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  userRole: string | null = null;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.userRole = this.authService.getCurrentUserRole();
    this.fetchData();
  }

  handleFilter(filter: Filter) {
    if (this.user != null) {
      this.postService.filterInPostsByState(filter, State.SUBMITTED,this.user.username,this.user.id).subscribe({
        next: posts => {
          this.submittedPosts = posts;
        },
        error: err => {
          console.error('Error filtering posts:', err);
        }
      });
    }
  }

  fetchData(): void {
    if (this.user) { 
      if (this.user.username && this.user.id) { 
        this.postService.getPostsByState(State.SUBMITTED, this.user.username, this.user.id).subscribe({
          next: posts => {
            this.submittedPosts = posts;
          },
          error: err => {
            console.error('Error fetching published posts for editor:', err);
          }
        });
      } else {
        console.error('User object is missing username or id.');
      }
    } else {
      console.error('No user found.');
    }
  }
  
}
