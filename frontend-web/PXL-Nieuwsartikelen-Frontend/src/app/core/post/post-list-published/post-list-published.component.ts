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
  filteredData!: Post[];
  publishedPosts!: Post[];
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;

  constructor(private postService: PostService) { }

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
    this.postService.getPublishedPosts().subscribe({
      next: posts => {
        this.filteredData = posts;
        this.publishedPosts = posts.filter(post => post.state === State.PUBLISHED);
      }
    });
  }
}
