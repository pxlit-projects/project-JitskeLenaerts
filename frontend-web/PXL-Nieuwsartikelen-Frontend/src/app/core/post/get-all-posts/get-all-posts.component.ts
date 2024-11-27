import { Component, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { Filter } from '../../../shared/models/filter.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../filter/filter.component";
import { PostItemComponent } from "../post-item/post-item.component";

@Component({
  selector: 'app-get-all-posts',
  standalone: true,
  imports: [RouterModule, CommonModule, FilterComponent, PostItemComponent],
  templateUrl: './get-all-posts.component.html',
  styleUrl: './get-all-posts.component.css'
})
export class GetAllPostsComponent implements OnInit {
  filteredData!: Post[];
  conceptPosts!: Post[];
  publishedPosts!: Post[];

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
    this.publishedPosts = posts.filter(post => !post.concept);
  }
}
