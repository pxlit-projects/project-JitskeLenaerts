import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { PostListSubmittedComponent } from "./post-list-submitted.component";
import { FilterComponent } from "../filter/filter.component";
import { PostItemComponent } from "../post-item/post-item.component";
import { PostService } from "../../../shared/services/post.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Filter } from "../../../shared/models/filter.model";
import { Post } from "../../../shared/models/post.model";
import { State } from "../../../shared/models/state.enum";
import { User } from "../../../shared/models/user.model";

describe('PostListSubmittedComponent', () => {
  let component: PostListSubmittedComponent;
  let fixture: ComponentFixture<PostListSubmittedComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Submitted Post 1', content: 'Content 1', state: State.SUBMITTED, authorId: 1, author: 'User 1', category: 'Category 1', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Submitted Post 2', content: 'Content 2', state: State.SUBMITTED, authorId: 2, author: 'User 2', category: 'Category 2', createdAt: new Date(), updatedAt: new Date() }
  ];

  const mockUser: User = {
    id: 1, username: 'user1', role: 'editor',
    password: 'password', authorName: 'User 1'
  };

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockAuthService.getCurrentUserRole.and.returnValue('editor');

    await TestBed.configureTestingModule({
      imports: [PostListSubmittedComponent, PostItemComponent, FilterComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load submitted posts on ngOnInit', () => {
    mockPostService.getPostsByState.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(mockPostService.getPostsByState).toHaveBeenCalledWith(State.SUBMITTED, mockUser.username, mockUser.id);
    expect(component.submittedPosts).toEqual(mockPosts);
  });

  it('should handle error when loading submitted posts', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockPostService.getPostsByState.and.returnValue(throwError(() => new Error('Failed to fetch posts')));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching published posts for editor:', jasmine.any(Error));
  });

  it('should filter submitted posts successfully', () => {
    const mockFilter: Filter = { title: '', author: '', content: '', category: '', createdAt: null };

    mockPostService.filterInPostsByState.and.returnValue(of(mockPosts));

    component.handleFilter(mockFilter);

    expect(mockPostService.filterInPostsByState).toHaveBeenCalledWith(mockFilter, State.SUBMITTED, mockUser.username, mockUser.id);
    expect(component.submittedPosts).toEqual(mockPosts);
  });

  it('should handle error when filtering submitted posts', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const mockFilter: Filter = { title: '', author: '', content: '', category: '', createdAt: null };

    mockPostService.filterInPostsByState.and.returnValue(throwError(() => new Error('Failed to filter posts')));

    component.handleFilter(mockFilter);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error filtering posts:', jasmine.any(Error));
  });

});
