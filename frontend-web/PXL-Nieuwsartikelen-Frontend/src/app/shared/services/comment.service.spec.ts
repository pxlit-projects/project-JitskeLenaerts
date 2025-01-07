import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { Comment } from '../models/comment.model';
import { environment } from '../../../environments/environment.development';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + 'comment/api/comment';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  
  });

  describe('createComment', () => {
    it('should send a POST request to create a new comment with default values for username and userId', () => {
      const commentRequest: Comment = {
        id: 1,
        postId: 1,
        comment: 'Test comment',
        author: 'John Doe',
        authorId: 1,
        createdAt: '2025-01-07T10:00:00Z',
        updatedAt: '2025-01-07T10:00:00Z'
      };

      service.createComment(commentRequest).subscribe((response) => {
        expect(response).toEqual(commentRequest);
      });

      const req = httpMock.expectOne({
        method: 'POST',
        url: apiUrl
      });

      expect(req.request.headers.get('username')).toBe('');
      expect(req.request.headers.get('userId')).toBe('0');

      req.flush(commentRequest);
    });

    it('should throw an error if username or userId is missing', () => {
      const commentRequest: Comment = {
        id: 1,
        postId: 1,
        comment: 'Test comment',
        author: 'John Doe',
        authorId: 1,
        createdAt: '2025-01-07T10:00:00Z',
        updatedAt: '2025-01-07T10:00:00Z'
      };

      service.createComment(commentRequest, '', 0).subscribe({
        next: () => fail('expected an error'),
        error: (error) => {
          expect(error.message).toBe('Username and UserId are required');
        }
      });

      httpMock.verify(); 
    });
  });

  describe('getAllComments', () => {
    it('should retrieve all comments', () => {
      const mockComments: Comment[] = [
        { id: 1, postId: 1, comment: 'Test comment 1', author: 'John Doe', authorId: 1, createdAt: '2025-01-07T10:00:00Z', updatedAt: '2025-01-07T10:00:00Z' },
        { id: 2, postId: 1, comment: 'Test comment 2', author: 'Jane Doe', authorId: 2, createdAt: '2025-01-07T10:00:00Z', updatedAt: '2025-01-07T10:00:00Z' }
      ];

      service.getAllComments().subscribe((comments) => {
        expect(comments.length).toBe(2);
        expect(comments).toEqual(mockComments);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });
  });

  describe('getCommentsByPostId', () => {
    it('should retrieve comments for a specific postId', () => {
      const postId = 1;
      const mockComments: Comment[] = [
        { id: 1, postId: 1, comment: 'Test comment 1', author: 'John Doe', authorId: 1, createdAt: '2025-01-07T10:00:00Z', updatedAt: '2025-01-07T10:00:00Z' }
      ];

      service.getCommentsByPostId(postId).subscribe((comments) => {
        expect(comments.length).toBe(1);
        expect(comments).toEqual(mockComments);
      });

      const req = httpMock.expectOne({
        method: 'GET',
        url: `${apiUrl}/${postId}`
      });
      expect(req.request.headers.get('username')).toBe('');
      expect(req.request.headers.get('userId')).toBe('0');
      req.flush(mockComments);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', () => {
      const commentId = 1;
      const commentRequest: Comment = {
        id: 1,
        postId: 1,
        comment: 'Updated comment',
        author: 'John Doe',
        authorId: 1,
        createdAt: '2025-01-07T10:00:00Z',
        updatedAt: '2025-01-07T10:00:00Z'
      };

      service.updateComment(commentId, commentRequest, 'JohnDoe', 1).subscribe((response) => {
        expect(response).toEqual(commentRequest);
      });

      const req = httpMock.expectOne({
        method: 'PATCH',
        url: `${apiUrl}/${commentId}`
      });
      expect(req.request.headers.get('username')).toBe('JohnDoe');
      expect(req.request.headers.get('userId')).toBe('1');
      req.flush(commentRequest);
    });
  });

  describe('deleteComment', () => {
    it('should send a DELETE request to delete a comment', () => {
      const commentId = 1;
  
      service.deleteComment(commentId, 'JohnDoe', 1).subscribe((response) => {
        expect(response).toBeUndefined(); 
      });
  
      const req = httpMock.expectOne({
        method: 'DELETE',
        url: `${apiUrl}/${commentId}`
      });
      expect(req.request.headers.get('username')).toBe('JohnDoe');
      expect(req.request.headers.get('userId')).toBe('1');
      req.flush(null); 
    });
  });
  
});
