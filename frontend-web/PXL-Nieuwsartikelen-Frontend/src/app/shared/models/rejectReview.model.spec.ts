import { RejectReview } from '../models/rejectReview.model';

describe('RejectReview Interface', () => {
  it('should accept a valid RejectReview object', () => {
    const rejectReview: RejectReview = {
      postId: 1,
      reason: 'The content does not meet the guidelines.',
    };

    expect(rejectReview).toBeTruthy();
    expect(rejectReview.postId).toBe(1);
    expect(rejectReview.reason).toBe('The content does not meet the guidelines.');
  });

  it('should allow an empty reason', () => {
    const rejectReview: RejectReview = {
      postId: 2,
      reason: '',
    };

    expect(rejectReview.postId).toBe(2);
    expect(rejectReview.reason).toBe('');
  });

  it('should handle large postId values', () => {
    const rejectReview: RejectReview = {
      postId: 123456789,
      reason: 'This is a test for a large postId value.',
    };

    expect(rejectReview.postId).toBe(123456789);
    expect(rejectReview.reason).toBe('This is a test for a large postId value.');
  });
});
