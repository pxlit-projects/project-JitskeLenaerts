import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListApprovedComponent } from './post-list-approved.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { User } from '../../../shared/models/user.model';
import { State } from '../../../shared/models/state.enum';
import { Filter } from '../../../shared/models/filter.model';

describe('PostListApprovedComponent', () => {
  let component: PostListApprovedComponent;
  let fixture: ComponentFixture<PostListApprovedComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: User = { 
    id: 1, 
    username: 'testuser', 
    password: 'password', 
    role: 'user', 
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
      state: State.APPROVED, 
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
      state: State.APPROVED, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    }
  ];

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    TestBed.configureTestingModule({
      imports: [PostListApprovedComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListApprovedComponent);
    component = fixture.componentInstance;
    
    mockAuthService.getCurrentUser.and.returnValue(mockUser);  
    mockAuthService.getCurrentUserRole.and.returnValue(mockUser.role);

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize user and load approved posts', () => {
      spyOn(component, 'loadApprovedPosts'); 

      component.ngOnInit();

      expect(component.user).toBe(mockUser); 
      expect(component.userRole).toBe(mockUser.role); 
      expect(component.loadApprovedPosts).toHaveBeenCalled(); 
    });
  });

  describe('loadApprovedPosts', () => {
    it('should load posts for approved state', () => {
      mockPostService.getPostsByState.and.returnValue(of(mockPosts));

      component.loadApprovedPosts(); 

      expect(mockPostService.getPostsByState).toHaveBeenCalledWith(State.APPROVED, mockUser.username, mockUser.id);
      expect(component.approvedPosts.length).toBe(2); 
      expect(component.approvedPosts).toEqual(mockPosts); 
    });

    it('should log an error if no user is found', () => {
      mockAuthService.getCurrentUser.and.returnValue(null); 

      const consoleErrorSpy = spyOn(console, 'error'); 

      component.loadApprovedPosts(); 

      expect(consoleErrorSpy).toHaveBeenCalledWith('No user found.'); 
    });
  });

  describe('handleFilter', () => {
    it('should filter posts based on the filter and state', () => {
      const filter: Filter = {
        category: 'Category 1',    
        title: 'Test Title',       
        author: 'Test User',       
        content: 'Test content',   
        createdAt: new Date()      
      };
  
      mockPostService.filterInPostsByState.and.returnValue(of([mockPosts[0]])); 
  
      component.handleFilter(filter); 
  
      expect(mockPostService.filterInPostsByState).toHaveBeenCalledWith(filter, State.APPROVED, mockUser.username, mockUser.id);
      expect(component.approvedPosts.length).toBe(1); 
      expect(component.approvedPosts[0]).toEqual(mockPosts[0]); 
    });
  
    it('should log an error if filtering fails', () => {
      const filter: Filter = {
        category: 'Category 1',
        title: 'Test Title',
        author: 'Test User',
        content: 'Test content',
        createdAt: new Date()
      };
  
      mockPostService.filterInPostsByState.and.returnValue(throwError(() => new Error('Filter failed'))); 
  
      const consoleErrorSpy = spyOn(console, 'error');
  
      component.handleFilter(filter); 
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error)); 
    });
  });
});
