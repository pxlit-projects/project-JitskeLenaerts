import { Component, OnInit } from '@angular/core';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { PostItemComponent } from "../post-item/post-item.component";
import { FilterComponent } from "../filter/filter.component";

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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  handleFilter(filter: Filter) {

    this.postService.filterPosts(filter).subscribe({
      next: posts => {
        this.filteredData = posts;
        this.splitPostsByPublished(posts);
      }
    });
  }

  fetchData(): void {
    this.postService.getAllPosts().subscribe({
      next: posts => {
        this.filteredData = posts;
        this.splitPostsByPublished(posts);
      }
    });
  }

  splitPostsByPublished(posts: Post[]): void {
    this.publishedPosts = posts.filter(post => !post.concept);
  }
}
