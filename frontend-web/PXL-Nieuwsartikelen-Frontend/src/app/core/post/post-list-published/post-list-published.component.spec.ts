import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListPublishedComponent } from './post-list-published.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { State } from '../../../shared/models/state.enum';

describe('PostListPublishedComponent', () => {
  let component: PostListPublishedComponent;
  let fixture: ComponentFixture<PostListPublishedComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'password',
    role: 'editor',
    authorName: 'Test User'
  };

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Published Post 1',
      content: 'Content 1',
      authorId: 1,
      author: 'Test User',
      category: 'Category 1',
      state: State.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Published Post 2',
      content: 'Content 2',
      authorId: 1,
      author: 'Test User',
      category: 'Category 2',
      state: State.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('PostService', [
      'getAllPublishedPosts', 'filterPublishedPosts'
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    TestBed.configureTestingModule({
      imports: [PostListPublishedComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListPublishedComponent);
    component = fixture.componentInstance;

    mockAuthService.getCurrentUser.and.returnValue(mockUser);  
    mockAuthService.getCurrentUserRole.and.returnValue(mockUser.role); 

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize user, role, and call fetchData()', () => {
      spyOn(component, 'fetchData'); 

      component.ngOnInit(); 

      expect(component.user).toBe(mockUser); 
      expect(component.userRole).toBe(mockUser.role); 
      expect(component.fetchData).toHaveBeenCalled(); 
    });
  });

  describe('fetchData', () => {
    it('should fetch published posts successfully', () => {
      mockPostService.getAllPublishedPosts.and.returnValue(of(mockPosts));
  
      component.fetchData(); 
  
      expect(mockPostService.getAllPublishedPosts).toHaveBeenCalled();
      expect(component.publishedPosts).toEqual(mockPosts); 
    });
  
    it('should handle error when fetching posts fails', () => {
      const consoleErrorSpy = spyOn(console, 'error');
      
      mockPostService.getAllPublishedPosts.and.returnValue(throwError(() => new Error('Failed to fetch posts')));
  
      component.fetchData(); 
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching published post:', jasmine.any(Error)); 
    });
  });
  

  describe('handleFilter', () => {
    it('should filter published posts successfully', () => {
      const filter: Filter = {
        category: 'Category 1',
        title: 'Published Post 1',
        author: 'Test User',
        content: 'Content 1',
        createdAt: new Date()
      };

      mockPostService.filterPublishedPosts.and.returnValue(of([mockPosts[0]])); 

      component.handleFilter(filter);

      expect(mockPostService.filterPublishedPosts).toHaveBeenCalledWith(filter); 
      expect(component.publishedPosts.length).toBe(1); 
      expect(component.publishedPosts[0]).toEqual(mockPosts[0]);
    });

    it('should handle error when filtering posts fails', () => {
      const filter: Filter = {
        category: 'Category 1',
        title: 'Published Post 1',
        author: 'Test User',
        content: 'Content 1',
        createdAt: new Date()
      };

      const consoleErrorSpy = spyOn(console, 'error'); 
      mockPostService.filterPublishedPosts.and.returnValue(throwError(() => new Error('Failed to filter posts')));

      component.handleFilter(filter); 

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error)); 
    });
  });
});
