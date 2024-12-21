import { routes } from './../../../app.routes';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

// Enum for State (backend enum)
export enum State {
  CONCEPT = "CONCEPT",
  SUBMITTED = "SUBMITTED",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  PUBLISHED = "PUBLISHED"
}

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatTooltipModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute);

  postId: number = this.route.snapshot.params['id'];
  postWithId$: Observable<Post> = this.postService.getPostById(this.postId);

  updateForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    content: ['', [Validators.required]],
    category: ['', [Validators.required]],
    state: [State.CONCEPT], 
  });

  stateOptions = Object.values(State);

  ngOnInit(): void {
    this.postWithId$.subscribe((post) => {
      this.updateForm.patchValue({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        state: post.state
      });
      this.adjustTextAreaHeight();
    });
  }

  adjustTextAreaHeight(): void {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  onTextAreaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  onUpdate(): void {
    if (this.updateForm.valid) {
      const updatedPost: Post = { ...this.updateForm.value };
      updatedPost.state = updatedPost.state; 

      this.postService.updatePost(this.postId, updatedPost).subscribe(() => {
        this.updateForm.reset();
        this.router.navigate(['/posts']);
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  onCancel(): void {
    this.router.navigate(['/posts']);
  }
}
