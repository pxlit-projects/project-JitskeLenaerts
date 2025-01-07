import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostItemComponent } from './post-item.component';
import { Router } from '@angular/router';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs'; 
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { provideRouter } from '@angular/router'; 

describe('PostItemComponent', () => {
  let component: PostItemComponent;
  let fixture: ComponentFixture<PostItemComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let router: Router;

  const mockUser: User = { id: 1, username: 'testuser', password: 'password', role: 'user', authorName: 'Test User' };
  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    authorId: 1,
    author: 'Test User',
    category: 'Test Category',
    state: State.CONCEPT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getUserById']);
    mockPostService = jasmine.createSpyObj('PostService', ['publishPost']);

    TestBed.configureTestingModule({
      imports: [PostItemComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostItemComponent);
    component = fixture.componentInstance;
    component.post = mockPost;
    component.showReviewsButton = true; 
    component.showPublishButton = true; 

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.getUserById.and.returnValue(mockUser); 

    fixture.detectChanges();
    router = TestBed.inject(Router); 
  });

  describe('ngOnInit', () => {
    it('should initialize authorName and user', () => {
      expect(component.authorName).toBe('Test User');
      expect(component.user).toBe(mockUser);
    });
  });

  describe('onViewReviews', () => {
    it('should emit the post id when viewReviews is triggered', () => {
      spyOn(component.viewReviews, 'emit'); 

      component.onViewReviews();
      expect(component.viewReviews.emit).toHaveBeenCalledWith(mockPost.id);
    });
  });

  describe('onPublishButton', () => {
    it('should update post state and navigate to /published/posts when post is published', () => {
      const updatedPost = { ...mockPost, state: State.PUBLISHED };
      mockPostService.publishPost.and.returnValue(of(updatedPost)); 

      spyOn(router, 'navigate'); 

      component.onPublishButton();

      expect(mockPostService.publishPost).toHaveBeenCalledWith(
        mockPost.id,
        mockPost,
        mockUser.username,
        mockUser.id
      );
      expect(component.post.state).toBe(State.PUBLISHED);
      expect(component.post).toEqual(updatedPost);
      expect(router.navigate).toHaveBeenCalledWith(['/published/posts']);
    });

    it('should log an error if publishing fails', () => {
      const errorMessage = 'Publish failed';
      mockPostService.publishPost.and.returnValue(throwError(() => new Error(errorMessage)));

      const consoleErrorSpy = spyOn(console, 'error');

      component.onPublishButton();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update post state:', errorMessage);
    });
  });

  describe('Constructor', () => {
    it('should create the component with injected services', () => {
      expect(component).toBeTruthy(); 

      expect(component['authService']).toBe(mockAuthService);
      expect(component['postService']).toBe(mockPostService);
      expect(component['router']).toBe(router);
    });
  });
});
