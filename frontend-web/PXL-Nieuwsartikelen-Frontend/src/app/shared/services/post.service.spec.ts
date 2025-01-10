import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';
import { State } from '../models/state.enum';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.development';
import { Filter } from '../models/filter.model';
import { provideHttpClient } from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  const apiUrl = environment.apiUrl + 'post/api/post';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostService,
        AuthService,
      ],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new post', () => {
    const newPost: Post = new Post(
      0,
      'New Post',
      'Author',
      1,
      'This is a new post.',
      'Category',
      State.CONCEPT,
      '2025-01-07T00:00:00Z',
      '2025-01-07T00:00:00Z'
    );

    service.createPost(newPost, 'gebruiker1', 1).subscribe((post) => {
      expect(post).toEqual({ ...newPost, id: 1 });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush({ ...newPost, id: 1 });
  });


  it('should fetch posts by state', () => {
    const mockPosts: Post[] = [
      new Post(1, 'Post 1', 'Author 1', 1, 'Content 1', 'Category', State.CONCEPT, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ];

    service.getPostsByState(State.CONCEPT, 'gebruiker1', 1).subscribe((posts) => {
      expect(posts.length).toBe(1);
      expect(posts[0].state).toBe(State.CONCEPT);
    });

    const req = httpMock.expectOne(`${apiUrl}/state/${State.CONCEPT}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
  it('should fetch a post by ID with default headers', () => {
    const mockPost = new Post(
      1,
      'Default Headers Post',
      'Author',
      0,
      'Content',
      'Category',
      State.PUBLISHED,
      '2025-01-07T00:00:00Z',
      '2025-01-07T00:00:00Z'
    );

    service.getPostById(1).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe('');
    expect(req.request.headers.get('userId')).toBe('0');
    req.flush(mockPost);
  });
  it('should return true when all filter criteria match the post', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      authorId: 1,
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      state: State.PUBLISHED,
      createdAt: new Date('2025-01-07T00:00:00Z'),
      updatedAt: new Date('2025-01-07T00:00:00Z'),
    };

    spyOn(authService, 'getUserById').and.returnValue({ username: 'username', id: 1, role: 'gebruiker', password: '', authorName: 'Test Author' });

    const filter: Filter = {
      title: 'Test',
      author: 'Test Author',
      content: 'Sample',
      category: 'Technology',
      createdAt: new Date('2025-01-07'),
    };

    const result = (service as any).isPostMatchingFilter(post, filter);
    expect(result).toBe(true);
  });

  it('should return false when title does not match', () => {
    const post: Post = {
      id: 1,
      title: 'Different Post',
      authorId: 1,
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      state: State.PUBLISHED,
      createdAt: new Date('2025-01-07T00:00:00Z'),
      updatedAt: new Date('2025-01-07T00:00:00Z'),
    };

    spyOn(authService, 'getUserById').and.returnValue({ username: 'username', id: 1, role: 'gebruiker', password: '', authorName: 'Test Author' });

    const filter: Filter = {
      title: 'Test',
      author: 'Test Author',
      content: 'Sample',
      category: 'Technology',
      createdAt: new Date('2025-01-07'),
    };

    const result = (service as any).isPostMatchingFilter(post, filter);
    expect(result).toBe(false);
  });

  it('should handle null, empty strings, and default true conditions gracefully', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      authorId: 1,
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      state: State.PUBLISHED,
      createdAt: new Date('2025-01-07T00:00:00Z'),
      updatedAt: new Date('2025-01-07T00:00:00Z'),
    };

    spyOn(authService, 'getUserById').and.returnValue({ username: 'username', id: 1, role: 'gebruiker', password: '', authorName: 'Test Author' });

    const filter: Filter = {
      title: '',
      author: '',
      content: '',
      category: '',
      createdAt: null,
    };

    const result = (service as any).isPostMatchingFilter(post, filter);
    expect(result).toBe(true);
  });

  it('should return true when createdAt filter is null and all other criteria match', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      authorId: 1,
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      state: State.PUBLISHED,
      createdAt: new Date('2025-01-07T00:00:00Z'),
      updatedAt: new Date('2025-01-07T00:00:00Z'),
    };

    spyOn(authService, 'getUserById').and.returnValue({ username: 'username', id: 1, role: 'gebruiker', password: '', authorName: 'Test Author' });

    const filter: Filter = {
      title: 'Test',
      author: 'Test Author',
      content: 'Sample',
      category: 'Technology',
      createdAt: null,
    };

    const result = (service as any).isPostMatchingFilter(post, filter);
    expect(result).toBe(true);
  });

  it('should return false when createdAt filter does not match', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      authorId: 1,
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      state: State.PUBLISHED,
      createdAt: new Date('2025-01-06'),
      updatedAt: new Date('2025-01-07'),
    };

    spyOn(authService, 'getUserById').and.returnValue({ username: 'username', id: 1, role: 'gebruiker', password: 'password' ,authorName: 'Test Author'});

    const filter: Filter = {
      title: 'Test',
      author: 'Test Author',
      content: 'Sample',
      category: 'Technology',
      createdAt: new Date('2025-01-07'),
    };

    const result = (service as any).isPostMatchingFilter(post, filter);
    expect(result).toBe(false);
  });

  it('should fetch a post by ID', () => {
    const mockPost = new Post(
      1,
      'Post 1',
      'Author 1',
      1,
      'Content',
      'Category',
      State.PUBLISHED,
      '2025-01-07T00:00:00Z',
      '2025-01-07T00:00:00Z'
    );

    service.getPostById(1, 'gebruiker1', 1).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should return true if title exists', () => {
    const mockPosts: Post[] = [
      new Post(1, 'Post 1', 'Author 1', 1, 'Content 1', 'Category', State.CONCEPT, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ];

    service.checkIfTitleExists('Post 1').subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should update a post', () => {
    const updatedPost: Post = new Post(
      1,
      'Updated Post',
      'Author 1',
      1,
      'Updated content',
      'Category',
      State.PUBLISHED,
      '2025-01-07T00:00:00Z',
      '2025-01-07T00:00:00Z'
    );

    service.updatePost(1, updatedPost, 'gebruiker1', 1).subscribe((post) => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPost);
    req.flush(updatedPost);
  });

  it('should filter posts by state and filter criteria', () => {
    const mockPosts: Post[] = [
      new Post(1, 'Post 1', 'Author 1', 1, 'Content 1', 'Category', State.CONCEPT, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
      new Post(2, 'Post 2', 'Author 2', 2, 'Content 2', 'Category', State.PUBLISHED, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ];

    spyOn(authService, 'getUserById').and.returnValue({ username: 'Author 1', authorName: 'Author 1', id: 1, role: 'gebruiker', password: '' });

    const filter = {
      title: 'Post 1',
      author: 'Author 1',
      content: '',
      category: '',
      createdAt: new Date('2025-01-07'),
    };

    service.filterInPostsByState(filter, State.CONCEPT, 'gebruiker1', 1).subscribe((posts) => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Post 1');
    });

    const req = httpMock.expectOne(`${apiUrl}/state/${State.CONCEPT}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch all published posts', () => {
    const mockPosts: Post[] = [
      new Post(1, 'Published Post 1', 'Author 1', 1, 'Content 1', 'Category 1', State.PUBLISHED, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
      new Post(2, 'Published Post 2', 'Author 2', 2, 'Content 2', 'Category 2', State.PUBLISHED, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ];

    service.getAllPublishedPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
  it('should fetch posts by author ID and state', () => {
    const mockState = 'APPROVED';
    const mockUsername = 'testUser';
    const mockUserId = 1;
    const mockPosts: Post[] = [
      new Post(1, 'Approved Post 1', 'Author 1', mockUserId, 'Content 1', 'Category 1', State.APPROVED, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
      new Post(2, 'Approved Post 2', 'Author 1', mockUserId, 'Content 2', 'Category 2', State.APPROVED, '2025-01-07T00:00:00Z', '2025-01-07T00:00:00Z'),
    ];

    service.getPostsByAuthorIdAndState(mockState, mockUsername, mockUserId).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/filter/${mockState}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(mockUsername);
    expect(req.request.headers.get('userId')).toBe(mockUserId.toString());
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockPosts);
  });
  it('should publish a post', () => {
    const mockId = 1;
    const mockUsername = 'testUser';
    const mockUserId = 1;
    const mockPost: Post = new Post(
      1,
      'Test Title',
      'Test Author',
      mockUserId,
      'Test Content',
      'Test Category',
      State.APPROVED,
      '2025-01-07T00:00:00Z',
      '2025-01-07T00:00:00Z'
    );

    const publishedPost: Post = { ...mockPost, state: State.PUBLISHED };

    service.publishPost(mockId, mockPost, mockUsername, mockUserId).subscribe((post) => {
      expect(post).toEqual(publishedPost);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockId}/publish`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('username')).toBe(mockUsername);
    expect(req.request.headers.get('userId')).toBe(mockUserId.toString());
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(mockPost);

    req.flush(publishedPost);
  });
  it('should filter published posts based on the provided filter', () => {
    const mockFilter: Filter = {
      title: 'test',
      author: 'Test Author',
      content: 'Sample Content',
      category: 'Technology',
      createdAt: new Date('2025-01-07'),
    };

    const mockPosts: Post[] = [
      new Post(
        1,
        'Test Post 1',
        'Test Author',
        1,
        'Sample Content 1',
        'Technology',
        State.PUBLISHED,
        '2025-01-07T00:00:00Z',
        '2025-01-07T00:00:00Z'
      ),
      new Post(
        2,
        'Another Post',
        'Another Author',
        2,
        'Different Content',
        'Other Category',
        State.PUBLISHED,
        '2025-01-07T00:00:00Z',
        '2025-01-07T00:00:00Z'
      ),
    ];

    const filteredPosts: Post[] = [
      new Post(
        1,
        'Test Post 1',
        'Test Author',
        1,
        'Sample Content 1',
        'Technology',
        State.PUBLISHED,
        '2025-01-07T00:00:00Z',
        '2025-01-07T00:00:00Z'
      ),
    ];

    spyOn(service as any, 'isPostMatchingFilter').and.callFake((post: Post, filter: Filter) => {
      return post.title.toLowerCase().includes(filter.title.toLowerCase()) &&
        post.author.toLowerCase().includes(filter.author.toLowerCase()) &&
        post.content.toLowerCase().includes(filter.content.toLowerCase()) &&
        post.category.toLowerCase().includes(filter.category.toLowerCase());
    });

    service.filterPublishedPosts(mockFilter).subscribe((posts) => {
      expect(posts).toEqual(filteredPosts);
    });

    const req = httpMock.expectOne(`${apiUrl}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });


  it('should return the original date if it is invalid', () => {
    const invalidDate = new Date('invalid-date');
    const normalizedDate = (service as any).normalizeDate(invalidDate);
    expect(normalizedDate).toBe(invalidDate);
  });

});
