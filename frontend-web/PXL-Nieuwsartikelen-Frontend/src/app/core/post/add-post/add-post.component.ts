import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { State } from '../../../shared/models/state.enum';
import { CanComponentDeactivate } from '../../../shared/guards/confirm-leave.guard';
// import { ConfirmLeaveModalComponent } from '../../confirm-leave-modal/confirm-leave-modal.component';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements CanComponentDeactivate {
  postService: PostService = inject(PostService);
  user: User | null | undefined;
  fb: FormBuilder = inject(FormBuilder);
  errorMessage: string | null = null;
  // isModalOpen: boolean = false;

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    category: ['', Validators.required],
    createdAt: [new Date().toISOString()],
    updatedAt: [new Date().toISOString()],
    state: ['', Validators.required]
  });
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  onSubmit(): void {
    if (!this.user) {
      this.errorMessage = 'User is not authenticated.';
      this.router.navigate(['/login']);
      return;
    }
  
    const newPost = { 
      ...this.postForm.value, 
      author: this.user.authorName, 
      authorId: this.user.id 
    };
  
    this.postService.checkIfTitleExists(newPost.title).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = 'This title already exists. Please choose another title.';
        } else {
          this.postService.createPost(newPost, this.user!.username, this.user!.id).subscribe({
            next: () => {
              this.postForm.reset();
              this.router.navigate([newPost.state === State.PUBLISHED ? '/published/posts' : '/concept/posts']);
            },
            error: (error) => {
              this.errorMessage = 'An error occurred while creating the post. Please try again.';
            }
          });
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while validating the title. Please try again.';
      }
    });
  }
  

  canDeactivate(): boolean {
    if (this.postForm.dirty) {
      return window.confirm('You have unsaved changes! Do you really want to leave?');
    }
    return true;
  }

  // canDeactivate(): boolean {
  //   if (this.postForm.dirty) {
  //     this.isModalOpen = true;
  //     return false;  
  //   }
  //   return true;
  // }

  // onConfirmLeave(confirmed: boolean): void {
  //   if (confirmed) {
  //     this.isModalOpen = false;
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.isModalOpen = false;
  //   }
  // }
}
