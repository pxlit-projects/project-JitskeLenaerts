import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { Filter } from "../../../shared/models/filter.model";
import { Post } from "../../../shared/models/post.model";
import { Review } from "../../../shared/models/review.model";
import { State } from "../../../shared/models/state.enum";
import { User } from "../../../shared/models/user.model";
import { AuthService } from "../../../shared/services/auth.service";
import { PostService } from "../../../shared/services/post.service";
import { ReviewService } from "../../../shared/services/review.service";
import { PostListRejectedComponent } from "./post-list-rejected.component";

describe('PostListRejectedComponent', () => {
    let component: PostListRejectedComponent;
    let fixture: ComponentFixture<PostListRejectedComponent>;
    let mockPostService: jasmine.SpyObj<PostService>;
    let mockReviewService: jasmine.SpyObj<ReviewService>;
    let mockAuthService: jasmine.SpyObj<AuthService>;
  
    const mockPosts: Post[] = [
      {
        id: 1, title: 'Rejected Post 1', content: 'Content 1', state: State.REJECTED, authorId: 1,
        author: "", category: "", createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 2, title: 'Rejected Post 2', content: 'Content 2', state: State.REJECTED, authorId: 2,
        author: "", category: "", createdAt: new Date(), updatedAt: new Date()
      }
    ];
  
    const mockReviews: Review[] = [
      { id: 1, postId: 1, reason: 'Reason 1', reviewer: 'Reviewer 1', reviewerId: 1, createdAt: '2025-01-07' },
      { id: 2, postId: 1, reason: 'Reason 2', reviewer: 'Reviewer 2', reviewerId: 2, createdAt: '2025-01-07' }
    ];
  
    const mockUser: User = {
      id: 1, username: 'user1', role: 'editor',
      password: "", authorName: ""
    };
  
    beforeEach(async () => {
      mockPostService = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
      mockReviewService = jasmine.createSpyObj('ReviewService', ['getReviewsForPost']);
      mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);
  
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.getCurrentUserRole.and.returnValue('editor');
  
      await TestBed.configureTestingModule({
        declarations: [PostListRejectedComponent],
        providers: [
          { provide: PostService, useValue: mockPostService },
          { provide: ReviewService, useValue: mockReviewService },
          { provide: AuthService, useValue: mockAuthService }
        ]
      })
      .compileComponents();
  
      fixture = TestBed.createComponent(PostListRejectedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
  
    it('should load rejected posts on ngOnInit', () => {
      mockPostService.getPostsByState.and.returnValue(of(mockPosts));
  
      component.ngOnInit();
  
      expect(mockPostService.getPostsByState).toHaveBeenCalledWith(State.REJECTED, mockUser.username, mockUser.id);
      expect(component.rejectedPosts).toEqual(mockPosts);
    });
  
    it('should handle error when loading rejected posts', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      mockPostService.getPostsByState.and.returnValue(throwError(() => new Error('Failed to fetch posts')));
  
      component.ngOnInit();
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching approved posts:', jasmine.any(Error));
    });
  
    it('should filter rejected posts successfully', () => {
      const mockFilter: Filter = {
        title: '',
        author: '',
        content: '',
        category: '',
        createdAt: null,
      };
  
      mockPostService.filterInPostsByState.and.returnValue(of(mockPosts));
  
      component.handleFilter(mockFilter);
  
      expect(mockPostService.filterInPostsByState).toHaveBeenCalledWith(mockFilter, State.REJECTED, mockUser.username, mockUser.id);
      expect(component.rejectedPosts).toEqual(mockPosts);
    });
  
    it('should handle error when filtering rejected posts', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const mockFilter: Filter = {
        title: '',
        author: '',
        content: '',
        category: '',
        createdAt: null,
      };
  
      mockPostService.filterInPostsByState.and.returnValue(throwError(() => new Error('Failed to filter posts')));
  
      component.handleFilter(mockFilter);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error));
    });
  
    it('should get reviews for a post successfully', () => {
      const postId = 1;
      mockReviewService.getReviewsForPost.and.returnValue(of(mockReviews));
  
      component.getReviewsForPost(postId);
  
      expect(mockReviewService.getReviewsForPost).toHaveBeenCalledWith(postId);
      expect(component.reviews).toEqual(mockReviews);
    });
  
    it('should handle error when fetching reviews for a post', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      const postId = 1;
  
      mockReviewService.getReviewsForPost.and.returnValue(throwError(() => new Error('Failed to fetch reviews')));
  
      component.getReviewsForPost(postId);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching reviews for post:', jasmine.any(Error));
    });
  
    it('should warn when postId is undefined in getReviewsForPost', () => {
        const consoleWarnSpy = spyOn(console, 'warn');
        
        component.getReviewsForPost(0); 
        
        expect(consoleWarnSpy).toHaveBeenCalledWith('Post ID is undefined');
      });
      
      
  });
  
  