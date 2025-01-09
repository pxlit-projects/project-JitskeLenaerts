import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment.development';
import { Review } from '../models/review.model';
import { RejectReview } from '../models/rejectReview.model';
import { provideHttpClient } from '@angular/common/http';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  const mockApiUrl = environment.apiUrl + 'review/api/review';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reviews for a post', () => {
    const mockPostId = 1;
    const mockReviews: Review[] = [
      { id: 1, postId: mockPostId, reason: 'Inappropriate content', reviewer: 'John Doe', reviewerId: 123, createdAt: '2021-01-01' },
      { id: 2, postId: mockPostId, reason: 'Spam', reviewer: 'Jane Doe', reviewerId: 456, createdAt: '2021-01-02' },
    ];

    service.getReviewsForPost(mockPostId).subscribe((reviews) => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${mockPostId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  it('should approve a post', () => {
    const mockPostId = 2;

    service.approvePost(mockPostId).subscribe(() => {
      expect().nothing(); // Expect no error
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${mockPostId}/approve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('should reject a post', () => {
    const mockPostId = 3;
    const mockReviewer = 'John Doe';
    const mockReviewerId = 123;
    const mockRejectRequest: RejectReview = {
      postId: mockPostId,
      reason: 'Inappropriate content',
    };

    service.rejectPost(mockPostId, mockReviewer, mockReviewerId, mockRejectRequest).subscribe(() => {
      expect().nothing(); // Expect no error
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${mockPostId}/reject`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRejectRequest);
    expect(req.request.headers.get('reviewer')).toBe(mockReviewer);
    expect(req.request.headers.get('reviewerId')).toBe(mockReviewerId.toString());
    req.flush(null);
  });
});
