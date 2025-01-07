import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SubmittedReviewCheckComponent } from './submitted-review-check.component'; 
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { ReviewService } from '../../../shared/services/review.service';
import { FilterComponent } from '../../post/filter/filter.component';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { Filter } from '../../../shared/models/filter.model';
import { FormsModule } from '@angular/forms';

describe('SubmittedReviewCheckComponent', () => {
  let component: SubmittedReviewCheckComponent;
  let fixture: ComponentFixture<SubmittedReviewCheckComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;

  const mockUser: User = { id: 1, username: 'user1', role: 'admin', password: 'password', authorName: 'User One' };
  const mockPosts: Post[] = [
    { id: 1, title: 'Post 1', content: 'Content 1', state: State.SUBMITTED, authorId: 1, author: 'User One', category: 'Category 1', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Post 2', content: 'Content 2', state: State.SUBMITTED, authorId: 2, author: 'User Two', category: 'Category 2', createdAt: new Date(), updatedAt: new Date() }
  ];

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getUserById']);
    mockPostService = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['approvePost', 'rejectPost']);

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.getUserById.and.returnValue({ id: 1, username: 'user1', role: 'admin', password: 'password', authorName: 'User One' });

    await TestBed.configureTestingModule({
      imports: [FormsModule, FilterComponent],
      declarations: [SubmittedReviewCheckComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: ReviewService, useValue: mockReviewService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmittedReviewCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch submitted posts on ngOnInit', () => {
    mockPostService.getPostsByState.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(mockPostService.getPostsByState).toHaveBeenCalledWith(State.SUBMITTED, mockUser.username, mockUser.id);
    expect(component.posts).toEqual(mockPosts);
  });

  it('should handle error when fetching submitted posts', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockPostService.getPostsByState.and.returnValue(throwError(() => new Error('Failed to fetch posts')));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch submitted posts:', jasmine.any(Error));
  });

  it('should filter posts correctly using handleFilter', () => {
    const mockFilter: Filter = { title: '', author: '', content: '', category: '', createdAt: null };
    mockPostService.filterInPostsByState.and.returnValue(of(mockPosts));

    component.handleFilter(mockFilter);

    expect(mockPostService.filterInPostsByState).toHaveBeenCalledWith(mockFilter, State.SUBMITTED, mockUser.username, mockUser.id);
    expect(component.posts).toEqual(mockPosts);
  });

  it('should handle error when filtering posts', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const mockFilter: Filter = { title: '', author: '', content: '', category: '', createdAt: null };
    mockPostService.filterInPostsByState.and.returnValue(throwError(() => new Error('Failed to filter posts')));

    component.handleFilter(mockFilter);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error));
  });

  it('should approve post successfully', () => {
    mockReviewService.approvePost.and.returnValue(of(undefined)); 

    component.approvePost(1);

    expect(mockReviewService.approvePost).toHaveBeenCalledWith(1);
    expect(component.posts.length).toBe(1); 
  });

  it('should handle error when approving post', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockReviewService.approvePost.and.returnValue(throwError(() => new Error('Failed to approve post')));

    component.approvePost(1);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to approve post:', jasmine.any(Error));
  });

  it('should show rejection form when rejecting post', () => {
    component.showRejectForm(1);

    expect(component.rejectingPostId).toBe(1);
    expect(component.rejectionReason).toBe('');
  });

  it('should cancel rejection and clear rejection form', () => {
    component.rejectingPostId = 1;
    component.rejectionReason = 'Some reason';

    component.cancelRejection();

    expect(component.rejectingPostId).toBeNull();
    expect(component.rejectionReason).toBe('');
  });

  it('should reject post successfully', () => {
    const rejectReview = {
      postId: 1,
      reason: 'Not good enough',
      reviewer: mockUser.authorName,
      reviewerId: mockUser.id,
      createdAt: new Date().toISOString(),
    };
    mockReviewService.rejectPost.and.returnValue(of(undefined));  

    component.rejectionReason = 'Not good enough';
    component.rejectPost(1);

    expect(mockReviewService.rejectPost).toHaveBeenCalledWith(1, mockUser.authorName, mockUser.id, rejectReview);
    expect(component.posts.length).toBe(1); 
  });

  it('should alert and not reject post if reason is empty', () => {
    const alertSpy = spyOn(window, 'alert');
    component.rejectionReason = '';
    component.rejectPost(1);

    expect(alertSpy).toHaveBeenCalledWith('Please provide a reason for rejection.');
  });

  it('should handle error when rejecting post', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const rejectReview = {
      postId: 1,
      reason: 'Not good enough',
      reviewer: mockUser.authorName,
      reviewerId: mockUser.id,
      createdAt: new Date().toISOString(),
    };

    mockReviewService.rejectPost.and.returnValue(throwError(() => new Error('Failed to reject post')));

    component.rejectionReason = 'Not good enough';
    component.rejectPost(1);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to reject post:', jasmine.any(Error));
  });
});
