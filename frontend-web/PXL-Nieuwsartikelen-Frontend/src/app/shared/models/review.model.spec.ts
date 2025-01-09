import { Review } from './review.model';

describe('Review Interface', () => {
  it('should accept a valid Review object', () => {
    const review: Review = {
      id: 1,
      postId: 101,
      reason: 'The post was not clear.',
      reviewer: 'Alice Smith',
      reviewerId: 1001,
      createdAt: '2025-01-01T12:00:00Z',
    };

    expect(review.id).toBe(1);
    expect(review.postId).toBe(101);
    expect(review.reason).toBe('The post was not clear.');
    expect(review.reviewer).toBe('Alice Smith');
    expect(review.reviewerId).toBe(1001);
    expect(review.createdAt).toBe('2025-01-01T12:00:00Z');
  });

  it('should check if an object has all required properties for Review', () => {
    const incompleteReview = {
      id: 1,
      postId: 101,
      reviewer: 'Alice Smith',
      reviewerId: 1001,
    };

    const isValidReview = (obj: any): obj is Review => {
      return (
        typeof obj.id === 'number' &&
        typeof obj.postId === 'number' &&
        typeof obj.reason === 'string' &&
        typeof obj.reviewer === 'string' &&
        typeof obj.reviewerId === 'number' &&
        typeof obj.createdAt === 'string'
      );
    };

    expect(isValidReview(incompleteReview)).toBeFalse();
  });

  it('should handle runtime validation for dynamic data', () => {
    const review = {
      id: 1,
      postId: 101,
      reason: 'The post needs improvement.',
      reviewer: 'Bob Johnson',
      reviewerId: 2002,
      createdAt: '2025-01-02T15:00:00Z',
    };

    const isValidReview = (obj: any): obj is Review => {
      return (
        typeof obj.id === 'number' &&
        typeof obj.postId === 'number' &&
        typeof obj.reason === 'string' &&
        typeof obj.reviewer === 'string' &&
        typeof obj.reviewerId === 'number' &&
        typeof obj.createdAt === 'string'
      );
    };

    expect(isValidReview(review)).toBeTrue();
  });
});
