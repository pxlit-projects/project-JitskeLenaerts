import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmittedReviewCheckComponent } from './submitted-review-check.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ReviewService } from '../../../shared/services/review.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';
import { State } from '../../../shared/models/state.enum';
import { User } from '../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from '../../post/filter/filter.component';

describe('SubmittedReviewCheckComponent', () => {
  let component: SubmittedReviewCheckComponent;
  let fixture: ComponentFixture<SubmittedReviewCheckComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let authService: jasmine.SpyObj<AuthService>;
  let reviewService: jasmine.SpyObj<ReviewService>;

  const mockUser: User = {
    username: 'gebruiker1',
    password: 'gebruiker123',
    role: 'gebruiker',
    id: 1,
    authorName: 'Gebruiker Gevens',
  };

  const mockPosts: Post[] = [
    { id: 1, title: 'Post 1', author: 'gebruiker1', authorId: 1, content: 'Content', category: 'Category 1', state: State.SUBMITTED, createdAt: new Date(), updatedAt: new Date() }
  ];

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole', 'getUserById']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['approvePost', 'rejectPost']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, FilterComponent,SubmittedReviewCheckComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmittedReviewCheckComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;

    authService.getCurrentUser.and.returnValue(mockUser);
    postService.getPostsByState.and.returnValue(of(mockPosts));

  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load submitted posts on ngOnInit', () => {
    postService.getPostsByState.and.returnValue(of(mockPosts));
    component.ngOnInit();
    expect(component.posts).toEqual(mockPosts);
    expect(postService.getPostsByState).toHaveBeenCalledWith(State.SUBMITTED, mockUser.username, mockUser.id);
  });

  it('should handle filter and update posts', () => {
    const filter: Filter = { title: 'Post 1', author: 'gebruiker1', content: '', category: '', createdAt: null };
    postService.filterInPostsByState.and.returnValue(of(mockPosts));

    component.handleFilter(filter);

    expect(component.posts).toEqual(mockPosts);
    expect(postService.filterInPostsByState).toHaveBeenCalledWith(filter, State.SUBMITTED, mockUser.username, mockUser.id);
  });

  it('should log an error when fetching posts fails', () => {
    const error = new Error('Failed to fetch posts');
    postService.getPostsByState.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.fetchSubmittedPosts();

    expect(console.error).toHaveBeenCalledWith('Failed to fetch submitted posts:', error);
  });

  it('should log an error when approving a post fails', () => {
    const error = new Error('Failed to approve post');
    reviewService.approvePost.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.approvePost(1);

    expect(console.error).toHaveBeenCalledWith('Failed to approve post:', error);
  });

  it('should show reject form when clicking reject', () => {
    component.showRejectForm(1);
    expect(component.rejectingPostId).toBe(1);
    expect(component.rejectionReason).toBe('');
  });

  it('should cancel rejection', () => {
    component.cancelRejection();
    expect(component.rejectingPostId).toBeNull();
    expect(component.rejectionReason).toBe('');
  });


  it('should log an error when rejecting a post fails', () => {
    const error = new Error('Failed to reject post');
    reviewService.rejectPost.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.rejectionReason = 'Spam';
    component.rejectPost(1);

    expect(console.error).toHaveBeenCalledWith('Failed to reject post:', error);
  });
});
