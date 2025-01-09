import { Comment } from '../models/comment.model';

describe('Comment', () => {
  it('should create an instance of Comment with the provided values', () => {
    const id = 1;
    const postId = 101;
    const comment = 'This is a test comment';
    const author = 'John Doe';
    const authorId = 202;
    const createdAt = '2025-01-08T10:00:00Z';
    const updatedAt = '2025-01-08T12:00:00Z';

    const newComment = new Comment(id, postId, comment, author, authorId, createdAt, updatedAt);

    expect(newComment).toBeTruthy();
    expect(newComment.id).toBe(id);
    expect(newComment.postId).toBe(postId);
    expect(newComment.comment).toBe(comment);
    expect(newComment.author).toBe(author);
    expect(newComment.authorId).toBe(authorId);
    expect(newComment.createdAt).toBe(createdAt);
    expect(newComment.updatedAt).toBe(updatedAt);
  });

  it('should correctly initialize with valid data', () => {
    const comment = new Comment(2, 102, 'Another comment', 'Jane Doe', 303, '2025-01-08T11:00:00Z', '2025-01-08T13:00:00Z');

    expect(comment.id).toEqual(2);
    expect(comment.postId).toEqual(102);
    expect(comment.comment).toEqual('Another comment');
    expect(comment.author).toEqual('Jane Doe');
    expect(comment.authorId).toEqual(303);
    expect(comment.createdAt).toEqual('2025-01-08T11:00:00Z');
    expect(comment.updatedAt).toEqual('2025-01-08T13:00:00Z');
  });

  it('should handle empty strings for optional fields', () => {
    const comment = new Comment(3, 103, '', '', 404, '2025-01-08T14:00:00Z', '2025-01-08T15:00:00Z');

    expect(comment.comment).toEqual('');
    expect(comment.author).toEqual('');
  });

  it('should correctly update properties after initialization', () => {
    const comment = new Comment(4, 104, 'Initial comment', 'Sam Smith', 505, '2025-01-08T16:00:00Z', '2025-01-08T17:00:00Z');

    comment.comment = 'Updated comment';
    comment.updatedAt = '2025-01-08T18:00:00Z';

    expect(comment.comment).toEqual('Updated comment');
    expect(comment.updatedAt).toEqual('2025-01-08T18:00:00Z');
  });
});
