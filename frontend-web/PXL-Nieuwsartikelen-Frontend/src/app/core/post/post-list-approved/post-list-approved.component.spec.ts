import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListApprovedComponent } from './post-list-approved.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { State } from '../../../shared/models/state.enum';
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { provideRouter } from '@angular/router';

describe('PostListApprovedComponent', () => {
  let component: PostListApprovedComponent;
  let fixture: ComponentFixture<PostListApprovedComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post 1', content: 'Content of post 1', state: State.APPROVED, authorId: 1, author: 'testuser', category: 'test', createdAt: new Date('2021-01-01'), updatedAt: new Date('2021-01-01') },
    { id: 2, title: 'Test Post 2', content: 'Content of post 2', state: State.APPROVED, authorId: 1, author: 'testuser', category: 'test', createdAt: new Date('2021-01-01'), updatedAt: new Date('2021-01-01') },
  ];

  const mockUser: User = { username: 'testuser', id: 1, role: 'admin', authorName: 'Test User',password:'test' };

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole', 'getUserById']);

    authServiceSpy.getUserById.and.callFake((userId: number) => {
      return mockUser.id === userId ? mockUser : null;
    });

    await TestBed.configureTestingModule({
      imports: [PostListApprovedComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authService.getCurrentUser.and.returnValue(mockUser);
    authService.getCurrentUserRole.and.returnValue('admin');
    postService.getPostsByState.and.returnValue(of(mockPosts));

    fixture = TestBed.createComponent(PostListApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load approved posts on init', () => {
    expect(postService.getPostsByState).toHaveBeenCalledTimes(1);
    expect(postService.getPostsByState).toHaveBeenCalledWith(State.APPROVED, mockUser.username, mockUser.id);
    expect(component.approvedPosts).toEqual(mockPosts);
  });


  it('should handle filter correctly', () => {
    const filter: Filter = { title: 'Test', author: 'Test', content: 'Test', category: 'All', createdAt: null };

    postService.filterInPostsByState.and.returnValue(of(mockPosts));

    component.handleFilter(filter);
    expect(postService.filterInPostsByState).toHaveBeenCalledOnceWith(filter, State.APPROVED, mockUser.username, mockUser.id);
    expect(component.approvedPosts).toEqual(mockPosts);
  });

  it('should handle error when filtering posts', () => {
    const filter: Filter = { title: 'Test', author: 'Test', content: 'Test', category: 'All', createdAt: null };

    postService.filterInPostsByState.and.returnValue(throwError(() => new Error('Error occurred')));

    spyOn(console, 'error');
    component.handleFilter(filter);

    expect(console.error).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error));

    const errorArgs = (console.error as jasmine.Spy).calls.mostRecent().args;
    expect(errorArgs[1].message).toBe('Error occurred');
  });


  it('should handle error when loading posts', () => {
    postService.getPostsByState.and.returnValue(throwError(() => new Error('Error occurred')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching approved posts:', jasmine.any(Error));

    const errorArgs = (console.error as jasmine.Spy).calls.mostRecent().args;
    expect(errorArgs[1].message).toBe('Error occurred');
  });


  it('should log an error when no user is found', () => {
    authService.getCurrentUser.and.returnValue(null);
    spyOn(console, 'error');
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('No user found.');
  });
});
