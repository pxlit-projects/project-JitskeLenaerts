import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListSubmittedComponent } from './post-list-submitted.component';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';
import { CommonModule } from '@angular/common';

describe('PostListSubmittedComponent', () => {
  let component: PostListSubmittedComponent;
  let fixture: ComponentFixture<PostListSubmittedComponent>;
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
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getPostsByState', 'filterInPostsByState']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'getCurrentUserRole']);

    await TestBed.configureTestingModule({
      imports: [PostListSubmittedComponent, PostItemComponent, FilterComponent, CommonModule],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListSubmittedComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    authService.getCurrentUser.and.returnValue(mockUser);
    authService.getCurrentUserRole.and.returnValue('gebruiker');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
