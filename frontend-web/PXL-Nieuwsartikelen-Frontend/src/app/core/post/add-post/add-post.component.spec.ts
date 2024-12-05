import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../shared/services/post.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['createPost']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddPostComponent, ReactiveFormsModule, CommonModule], 
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.postForm.value.title).toBe('');
    expect(component.postForm.value.content).toBe('');
    expect(component.postForm.value.author).toBe('');
    expect(component.postForm.value.category).toBe('');
    expect(component.postForm.value.createdAt).toBeDefined();
    expect(component.postForm.value.updatedAt).toBeDefined();
    expect(component.postForm.value.concept).toBe(false);
  });

  it('should call createPost when form is valid', () => {
    component.postForm.setValue({
      title: 'New Post',
      content: 'Post content',
      author: 'Author',
      category: 'Category',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      concept: false
    });

    postService.createPost.and.returnValue(of({
      id: 1,
      title: 'New Post',
      author: 'Author',
      content: 'Post content',
      category: 'Category',
      concept: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })); 

    component.onSubmit();

    expect(postService.createPost).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'New Post' }));
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should not call createPost if form is invalid', () => {
    component.postForm.setValue({
      title: '',
      content: '',
      author: '',
      category: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      concept: false
    });

    component.onSubmit();

    expect(postService.createPost).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
