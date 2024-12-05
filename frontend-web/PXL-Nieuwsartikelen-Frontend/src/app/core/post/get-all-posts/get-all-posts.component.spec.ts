import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAllPostsComponent } from './get-all-posts.component'; 
import { PostService } from '../../../shared/services/post.service'; 
import { of } from 'rxjs'; 
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';

describe('GetAllPostsComponent', () => {
  let component: GetAllPostsComponent;
  let fixture: ComponentFixture<GetAllPostsComponent>;
  let postService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getAllPosts', 'filterPosts']);

    await TestBed.configureTestingModule({
      imports: [GetAllPostsComponent], 
      providers: [
        { provide: PostService, useValue: postServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GetAllPostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;

    postService.getAllPosts.and.returnValue(of([])); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and split posts on init', () => {
    const mockPosts = [
      { concept: true } as Post,
      { concept: false } as Post
    ];

    postService.getAllPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.conceptPosts.length).toBe(1);
    expect(component.publishedPosts.length).toBe(1); 
  });

  it('should handle filter and split posts', () => {
    const mockFilter: Filter = {
      title: '',
      author: '',
      content: '',
      category: '',
      createdAt: new Date()
    };
    const mockPosts = [
      { concept: true } as Post,
      { concept: false } as Post
    ];

    postService.filterPosts.and.returnValue(of(mockPosts));

    component.handleFilter(mockFilter);

    expect(component.conceptPosts.length).toBe(1);
    expect(component.publishedPosts.length).toBe(1);
  });
});
