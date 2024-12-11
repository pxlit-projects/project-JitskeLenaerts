import { Component, OnInit } from '@angular/core';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { FilterComponent } from "../filter/filter.component";
import { PostItemComponent } from "../post-item/post-item.component";

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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  handleFilter(filter: Filter) {

    this.postService.filterPosts(filter).subscribe({
      next: posts => {
        this.filteredData = posts;
        this.splitPostsByConcept(posts);
      }
    });
  }

  fetchData(): void {
    this.postService.getAllPosts().subscribe({
      next: posts => {
        this.filteredData = posts;
        this.splitPostsByConcept(posts);
      }
    });
  }

  splitPostsByConcept(posts: Post[]): void {
    this.conceptPosts = posts.filter(post => post.concept);
  }
}
