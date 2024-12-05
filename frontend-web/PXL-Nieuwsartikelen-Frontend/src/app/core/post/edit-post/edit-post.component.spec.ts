import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditPostComponent } from './edit-post.component';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;
  let fb: FormBuilder;
  let mockPostId = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostComponent, ReactiveFormsModule],
      providers: [
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', ['getPostById', 'updatePost'])
        },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: mockPostId
              }
            }
          }
        },
        FormBuilder
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the update form on ngOnInit', fakeAsync(() => {
    const mockPost: Post = {
      id: mockPostId,
      title: 'Test Post',
      author: 'John Doe',
      content: 'This is a test post content.',
      category: 'News',
      concept: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    postService.getPostById.and.returnValue(of(mockPost));

    component.ngOnInit();

    tick();

    fixture.detectChanges();

    expect(component.updateForm.value).toEqual({
      title: mockPost.title,
      author: mockPost.author,
      content: mockPost.content,
      category: mockPost.category,
      concept: mockPost.concept
    });
  }));

  it('should update the post on update and navigate to posts list', fakeAsync(() => {
    const updatedPost: Post = {
      id: mockPostId,
      title: 'Updated Title',
      author: 'Jane Doe',
      content: 'Updated content.',
      category: 'Tech',
      concept: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    postService.updatePost.and.returnValue(of(updatedPost));

    component.updateForm.setValue(updatedPost);
    component.onUpdate();

    tick();

    expect(postService.updatePost).toHaveBeenCalledWith(mockPostId, updatedPost);
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  }));

  it('should show alert message if form is invalid on update', () => {
    spyOn(window, 'alert');

    component.updateForm.setValue({ title: '' });
    component.onUpdate();

    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields');
    expect(postService.updatePost).not.toHaveBeenCalled();
  });

  it('should handle errors during post update', fakeAsync(() => {
    spyOn(window, 'alert');
    const errorMessage = 'Error updating post';
    postService.updatePost.and.returnValue(throwError(() => new Error(errorMessage)));

    component.updateForm.setValue({ title: 'Test Title', author: 'Test Author', content: 'Test Content', category: 'Test Category', concept: false });
    component.onUpdate();

    tick();

    expect(window.alert).toHaveBeenCalledWith(errorMessage);
  }));

  it('should navigate to posts list on cancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });
});