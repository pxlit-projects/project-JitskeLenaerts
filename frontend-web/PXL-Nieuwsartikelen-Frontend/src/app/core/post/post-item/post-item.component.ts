import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})

export class PostItemComponent {
  @Input() post!: Post;

  readonly State = State;
}
