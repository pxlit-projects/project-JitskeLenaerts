import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListConceptComponent } from './post-list-concept.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Filter } from '../../../shared/models/filter.model';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { of, throwError } from 'rxjs';
import { User } from '../../../shared/models/user.model';

describe('PostListConceptComponent', () => {
  let component: PostListConceptComponent;
  let fixture: ComponentFixture<PostListConceptComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: User = { 
    id: 1, 
    username: 'testuser', 
    password: 'password', 
    role: 'redacteur', 
    authorName: 'Test User' 
  };

  const mockPosts: Post[] = [
    { 
      id: 1, 
      title: 'Post 1', 
      content: 'Content 1', 
      authorId: 1, 
      author: 'Test User', 
      category: 'Category 1', 
      state: State.CONCEPT, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    { 
      id: 2, 
      title: 'Post 2', 
      content: 'Content 2', 
      authorId: 1, 
      author: 'Test User', 
      category: 'Category 2', 
      state: State.CONCEPT, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }
  ];

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPostsByState', 'getPostsByAuthorIdAndState', 'filterInPostsByState'
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    TestBed.configureTestingModule({
      imports: [PostListConceptComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListConceptComponent);
    component = fixture.componentInstance;

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.getCurrentUserRole.and.returnValue(mockUser.role); 

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize user and role and fetch data based on user role', () => {
      spyOn(component, 'fetchData'); 

      component.ngOnInit();

      expect(component.user).toBe(mockUser);
      expect(component.userRole).toBe(mockUser.role); 
      expect(component.fetchData).toHaveBeenCalled(); 
    });
  });

  describe('fetchData', () => {
    it('should fetch concept posts for a "redacteur" role', () => {
      mockPostService.getPostsByState.and.returnValue(of(mockPosts)); 

      component.fetchData();

      expect(mockPostService.getPostsByState).toHaveBeenCalledWith(State.CONCEPT, mockUser.username, mockUser.id);
      expect(component.conceptPosts.length).toBe(2); 
      expect(component.conceptPosts).toEqual(mockPosts); 
    });

    it('should fetch concept posts by author for non "redacteur" role', () => {
      mockUser.role = 'user'; 
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockAuthService.getCurrentUserRole.and.returnValue('user');
      mockPostService.getPostsByAuthorIdAndState.and.returnValue(of(mockPosts)); 

      component.fetchData();

      expect(mockPostService.getPostsByAuthorIdAndState).toHaveBeenCalledWith(State.CONCEPT, mockUser.username, mockUser.id); 
      expect(component.conceptPosts.length).toBe(2); 
      expect(component.conceptPosts).toEqual(mockPosts); 
    });

    it('should log an error if fetching posts fails', () => {
      const consoleErrorSpy = spyOn(console, 'error'); 
      mockPostService.getPostsByState.and.returnValue(throwError(() => new Error('Failed to fetch posts')));

      component.fetchData(); 

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching concept posts for editor:', jasmine.any(Error)); 
    });
  });

  describe('handleFilter', () => {
    it('should filter posts by state', () => {
      const filter: Filter = {
        category: 'Category 1',
        title: 'Test Title',
        author: 'Test User',
        content: 'Test content',
        createdAt: new Date()
      };

      mockPostService.filterInPostsByState.and.returnValue(of([mockPosts[0]])); 

      component.handleFilter(filter);

      expect(mockPostService.filterInPostsByState).toHaveBeenCalledWith(filter, State.CONCEPT, mockUser.username, mockUser.id); 
      expect(component.conceptPosts.length).toBe(1); 
      expect(component.conceptPosts[0]).toEqual(mockPosts[0]); 
    });

    it('should log an error if filtering posts fails', () => {
      const filter: Filter = {
        category: 'Category 1',
        title: 'Test Title',
        author: 'Test User',
        content: 'Test content',
        createdAt: new Date()
      };

      const consoleErrorSpy = spyOn(console, 'error'); 
      mockPostService.filterInPostsByState.and.returnValue(throwError(() => new Error('Filter failed')));

      component.handleFilter(filter); 

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error));
    });
  });
});
