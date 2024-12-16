import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { AuthService } from '../../../shared/services/auth.service';  // Import AuthService

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post; 
  authorName: string = '';  

  readonly State = State;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const author = this.authService.getUserById(this.post.authorId);  
    if (author) {
      this.authorName = author.authorName;  
    }
  }
}
