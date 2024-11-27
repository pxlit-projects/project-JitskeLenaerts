import { routes } from './../../../app.routes';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit{
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
    concept: [false],
  });

  ngOnInit(): void {
    this.postWithId$.subscribe((post) => {
      this.updateForm.patchValue({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        concept: post.concept
      });
    });
  }

  onUpdate() {
    console.log('Ik kom erin de valid');
    console.log(this.postId);

    if (this.updateForm.valid) {
      console.log('Formulier is geldig');

      const updatedPost: Post = { ...this.updateForm.value };
      this.postService.updatePost(this.postId, updatedPost).subscribe(() => {
        this.updateForm.reset();
        this.router.navigate(['/posts']);
      });
    } else {
      console.log('Formulier is ongeldig:', this.updateForm.errors);
      console.log('Formulierwaarden:', this.updateForm.value);
    }
  }

  onCancel() {
    this.router.navigate(['/posts']);
  }
}
