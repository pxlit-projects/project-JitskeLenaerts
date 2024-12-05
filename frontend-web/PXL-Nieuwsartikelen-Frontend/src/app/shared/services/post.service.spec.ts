import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';
import { environment } from '../../../environments/environment.development';
import { Filter } from '../models/filter.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    author: 'Test Author',
    content: 'This is a test post',
    category: 'Test Category',
    concept: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Test Post 1',
      author: 'Author 1',
      content: 'Content 1',
      category: 'Category 1',
      concept: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Test Post 2',
      author: 'Author 2',
      content: 'Content 2',
      category: 'Category 2',
      concept: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a post', () => {
    service.createPost(mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('should fetch all posts', () => {
    service.getAllPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts); 
  });

  it('should fetch a post by id', () => {
    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost); 
  });

  it('should update a post', () => {
    const updatedPost = { ...mockPost, title: 'Updated Test Post' };

    service.updatePost(1, updatedPost).subscribe(post => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPost);
  });

  it('should filter posts by filter criteria', () => {
    const filter: Filter = {
      title: 'Test',
      author: 'Author 1',
      content: '',
      category: 'Category 1',
      createdAt: null
    };

    service.filterPosts(filter).subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Test Post 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts); 
  });

  it('should handle filtering with empty filter values', () => {
    const filter: Filter = {
      title: '',
      author: '',
      content: '',
      category: '',
      createdAt: null
    };

    service.filterPosts(filter).subscribe(posts => {
      expect(posts.length).toBe(2); 
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts); 
  });

  it('should handle errors gracefully', () => {
    service.getAllPosts().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    req.flush('Error fetching posts', { status: 500, statusText: 'Internal Server Error' });
  });
});
