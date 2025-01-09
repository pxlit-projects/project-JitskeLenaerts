import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListPublishedComponent } from './post-list-published.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';
import { State } from '../../../shared/models/state.enum';

describe('PostListPublishedComponent', () => {
  let component: PostListPublishedComponent;
  let fixture: ComponentFixture<PostListPublishedComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    username: 'gebruiker1',
    password: 'gebruiker123',
    role: 'gebruiker',
    id: 1,
    authorName: 'Gebruiker Gevens',
  };

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getAllPublishedPosts', 'filterPublishedPosts']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    await TestBed.configureTestingModule({
      imports: [PostListPublishedComponent, PostItemComponent, FilterComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListPublishedComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authService.getCurrentUser.and.returnValue(mockUser);
    authService.getCurrentUserRole.and.returnValue('gebruiker');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchData and set publishedPosts on ngOnInit', () => {
    const posts: Post[] = [
      { id: 1, title: 'Post 1', author: 'gebruiker1', authorId: 1, content: 'Content 1', category: 'Category 1', state: State.PUBLISHED, createdAt: new Date(), updatedAt: new Date() },
    ];
    postService.getAllPublishedPosts.and.returnValue(of(posts));

    component.ngOnInit();

    expect(component.publishedPosts).toEqual(posts);
    expect(postService.getAllPublishedPosts).toHaveBeenCalled();
  });

  it('should handle filter and update publishedPosts', () => {
    const filter: Filter = { title: 'Post', author: 'gebruiker1', content: '', category: '', createdAt: null };
    const filteredPosts: Post[] = [
      { id: 1, title: 'Post 1', author: 'gebruiker1', authorId: 1, content: 'Content 1', category: 'Category 1', state: State.PUBLISHED, createdAt: new Date(), updatedAt: new Date() },
    ];

    postService.filterPublishedPosts.and.returnValue(of(filteredPosts));

    component.handleFilter(filter);

    expect(component.publishedPosts).toEqual(filteredPosts);
    expect(postService.filterPublishedPosts).toHaveBeenCalledWith(filter);
  });

  it('should log an error when fetchData fails', () => {
    const error = new Error('Failed to fetch published posts');
    postService.getAllPublishedPosts.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching published post:', error);
  });

  it('should log an error when filter fails', () => {
    const filter: Filter = { title: 'Post', author: 'gebruiker1', content: '', category: '', createdAt: null };
    const error = new Error('Failed to filter posts');

    postService.filterPublishedPosts.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.handleFilter(filter);

    expect(console.error).toHaveBeenCalledWith('Error filtering posts:', error);
  });
});
