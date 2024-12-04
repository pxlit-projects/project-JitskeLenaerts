import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post.component';
import { PostService } from '../../../shared/services/post.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Post } from '../../../shared/models/post.model';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['createPost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        AddPostComponent, // Import the standalone component here
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.postForm).toBeDefined();
    expect(component.postForm.get('title')!.value).toBe('');
    expect(component.postForm.get('content')!.value).toBe('');
    expect(component.postForm.get('author')!.value).toBe('');
    expect(component.postForm.get('category')!.value).toBe('');
    expect(component.postForm.get('createdAt')!.value).toBeDefined();
    expect(component.postForm.get('updatedAt')!.value).toBeDefined();
  });

  it('should call postService.createPost when form is valid', () => {
    // Set valid form values
    component.postForm.setValue({
      title: 'Test Title',
      content: 'Test Content',
      author: 'Test Author',
      category: 'Test Category',
      createdAt: new Date(),  // Directly using Date object
      updatedAt: new Date(),  // Directly using Date object
      concept: false
    });

    // Mock the return value of createPost
    const mockPost: Post = {
      title: 'Test Title',
      content: 'Test Content',
      author: 'Test Author',
      category: 'Test Category',
      createdAt: new Date(),  // Directly using Date object
      updatedAt: new Date(),  // Directly using Date object
      concept: false
    };

    mockPostService.createPost.and.returnValue(of(mockPost));

    component.onSubmit();

    expect(mockPostService.createPost).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Title',
      content: 'Test Content',
      author: 'Test Author',
      category: 'Test Category'
    }));

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should not call postService.createPost if form is invalid', () => {
    component.postForm.setValue({
      title: '',
      content: 'Test Content',
      author: 'Test Author',
      category: 'Test Category',
      createdAt: new Date(),
      concept: false
    });

    component.onSubmit();

    expect(mockPostService.createPost).not.toHaveBeenCalled();
  });
});
