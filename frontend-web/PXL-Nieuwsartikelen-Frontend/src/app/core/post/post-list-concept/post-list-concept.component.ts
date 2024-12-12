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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  handleFilter(filter: Filter) {
    this.postService.filterPosts(filter).subscribe({
      next: posts => {
        this.filteredData = posts;
      }
    });
  }

  fetchData(): void {
      this.postService.getConceptPosts().subscribe({
        next: posts => {
          this.filteredData = posts;
          this.conceptPosts = posts.filter(post => post.state === State.CONCEPT);
        }
      });
  }

}
