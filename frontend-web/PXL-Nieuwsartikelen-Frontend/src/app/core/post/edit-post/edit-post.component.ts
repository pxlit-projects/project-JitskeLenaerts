import { routes } from './../../../app.routes';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { State } from '../../../shared/models/state.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatTooltipModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
})
export class EditPostComponent implements OnInit {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  State = State;
  user: User | null | undefined = null;
  postId: number = 0;
  postWithId!: Observable<Post>;
  hasEditableState: boolean = true;

  updateForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required]],
    category: ['', [Validators.required]],
    state: [State.CONCEPT],
  });

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      console.error('User is not authenticated or could not be fetched!');
      return;
    }

    this.postId = Number(this.route.snapshot.params['id']);
    if (isNaN(this.postId)) {
      console.error('Invalid post ID!');
      return;
    }

    this.postWithId = this.postService.getPostById(this.postId, this.user.username, this.user.id);
    this.postWithId.subscribe((post) => {
      this.updateForm.patchValue({
        title: post.title,
        content: post.content,
        category: post.category,
        state: State.CONCEPT,
      });
    });
  }


  onUpdate(): void {
    if (this.updateForm.valid) {
      if (this.user) {
        const updatedPost: Post = {
          ...this.updateForm.value,
          state: this.updateForm.get('state')?.value,
          author: this.user.authorName,
          authorId: this.user.id,
        };
        this.postService.updatePost(this.postId, updatedPost, this.user.username, this.user.id).subscribe(() => {
          this.updateForm.reset();
          if (updatedPost.state === State.SUBMITTED) {
            this.router.navigate(['/submitted/posts']);
          } else {
            this.router.navigate(['/concept/posts']);
          }
        });
      } else {
        alert('Please fill in all fields');
      }
    }
  }

  onCancel(): void {
    const state = this.updateForm.get('state')?.value;
    if (state === State.SUBMITTED) {
      this.router.navigate(['/submitted/posts']);
    } else {
      this.router.navigate(['/concept/posts']);
    }
  }
}
