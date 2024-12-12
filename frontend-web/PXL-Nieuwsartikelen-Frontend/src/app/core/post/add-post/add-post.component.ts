import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { State } from '../../../shared/models/state.enum';


@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  errorMessage: string | null = null;

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    category: ['', Validators.required],
    createdAt: [new Date().toISOString()],
    updatedAt: [new Date().toISOString()],
    state: ['', Validators.required]
  });

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  onSubmit(): void {
    if (!this.user) {
      this.errorMessage = 'User is not authenticated.';
      this.router.navigate(['/login']);
      return;
    }

    const newPost: Post = { ...this.postForm.value };
    newPost.author = this.user.authorName;
    newPost.authorId = this.user.id;

    this.postService.createPost(newPost, this.user.username, this.user.id).subscribe({
      next: () => {
        this.postForm.reset();
        if (newPost.state === State.PUBLISHED) {
          console.log('Published post');
          this.router.navigate(['/published/post']);
        }
        else {
          console.log('Concept post');
          this.router.navigate(['/concept/post']);
        }
      },
      error: (error: any) => {
        this.errorMessage = String(error).replace('Error: ', '');
      }
    });
  }
}
