import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListConceptComponent } from './post-list-concept.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { State } from '../../../shared/models/state.enum';
import { Filter } from '../../../shared/models/filter.model';
import { User } from '../../../shared/models/user.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';

describe('PostListConceptComponent', () => {
  let component: PostListConceptComponent;
  let fixture: ComponentFixture<PostListConceptComponent>;
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
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByState', 'getPostsByAuthorIdAndState', 'filterInPostsByState']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    await TestBed.configureTestingModule({
      imports: [PostListConceptComponent, PostItemComponent, FilterComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListConceptComponent);
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

  it('should call fetchData and set conceptPosts on ngOnInit', () => {
    const posts = [
      { id: 1, title: 'Post 1', author: 'gebruiker1', authorId: 1, content: 'Content 1', category: 'Category 1', state: State.CONCEPT, createdAt: new Date(), updatedAt: new Date() },
    ];
    postService.getPostsByAuthorIdAndState.and.returnValue(of(posts));

    component.ngOnInit();

    expect(component.conceptPosts).toEqual(posts);
    expect(postService.getPostsByAuthorIdAndState).toHaveBeenCalled();
  });

  it('should log an error when fetchData fails', () => {
    const error = new Error('Failed to fetch posts');
    postService.getPostsByAuthorIdAndState.and.returnValue(throwError(() => error));

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error fetching personal concept posts:', error);
  });

});
