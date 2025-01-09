import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListRejectedComponent } from './post-list-rejected.component';
import { PostService } from '../../../shared/services/post.service';
import { ReviewService } from '../../../shared/services/review.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Review } from '../../../shared/models/review.model';
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';
import { CommonModule } from '@angular/common';
import { State } from '../../../shared/models/state.enum';

describe('PostListRejectedComponent', () => {
  let component: PostListRejectedComponent;
  let fixture: ComponentFixture<PostListRejectedComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    username: 'gebruiker1',
    password: 'gebruiker123',
    role: 'gebruiker',
    id: 1,
    authorName: 'Gebruiker Gevens',
  };

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['getReviewsForPost']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    await TestBed.configureTestingModule({
      imports: [PostListRejectedComponent, PostItemComponent, FilterComponent, CommonModule],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListRejectedComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authService.getCurrentUser.and.returnValue(mockUser);
    authService.getCurrentUserRole.and.returnValue('gebruiker');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rejected posts on ngOnInit', () => {
    const posts: Post[] = [
      { id: 1, title: 'Rejected Post 1', author: 'gebruiker1', authorId: 1, content: 'Content 1', category: 'Category 1', state: State.REJECTED, createdAt: new Date(), updatedAt: new Date() },
    ];
    postService.getPostsByState.and.returnValue(of(posts));

    component.ngOnInit();

    expect(component.rejectedPosts).toEqual(posts);
    expect(postService.getPostsByState).toHaveBeenCalledWith(State.REJECTED, mockUser.username, mockUser.id);
  });

  it('should get reviews for a post', () => {
    const postId = 1;

    const reviews: Review[] = [
      { id: 1, postId: 1, reason: 'Reason 1', reviewer: 'Reviewer 1', reviewerId: 1, createdAt: '2021-01-01' },
    ];

    reviewService.getReviewsForPost.and.returnValue(of(reviews));

    component.getReviewsForPost(postId);

    expect(component.reviews).toEqual(reviews);
    expect(reviewService.getReviewsForPost).toHaveBeenCalledWith(postId);
  });

  it('should log an error when getReviewsForPost fails', () => {
    const postId = 1;
    const error = new Error('Failed to fetch reviews');
    reviewService.getReviewsForPost.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.getReviewsForPost(postId);

    expect(console.error).toHaveBeenCalledWith('Error fetching reviews for post:', error);
  });

});
