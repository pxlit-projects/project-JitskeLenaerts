import { Component, Input } from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})
export class PostItemComponent {
  @Input() post!: Post;

}
