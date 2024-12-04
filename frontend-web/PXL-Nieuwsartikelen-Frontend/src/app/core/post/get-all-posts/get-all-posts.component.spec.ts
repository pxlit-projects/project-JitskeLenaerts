import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetAllPostsComponent } from './get-all-posts.component';
import { PostService } from '../../../shared/services/post.service';
import { of } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Filter } from '../../../shared/models/filter.model';
import { FilterComponent } from '../filter/filter.component';
import { PostItemComponent } from '../post-item/post-item.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('GetAllPostsComponent', () => {
  let component: GetAllPostsComponent;
  let fixture: ComponentFixture<GetAllPostsComponent>;
  let postService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    // Maak een mock van de PostService
    const postServiceSpy = jasmine.createSpyObj('PostService', ['getAllPosts', 'filterPosts']);

    await TestBed.configureTestingModule({
      imports: [GetAllPostsComponent, RouterModule, CommonModule, FilterComponent, PostItemComponent],
      providers: [{ provide: PostService, useValue: postServiceSpy }]
    })
    .compileComponents();

    // Maak het component aan en verkrijg de mock PostService
    fixture = TestBed.createComponent(GetAllPostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data on init and split posts by concept', () => {
    const mockPosts: Post[] = [
      {
        id: 1, title: 'Post 1', content: 'Content 1', concept: true, createdAt: new Date('2024-01-01'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2, title: 'Post 2', content: 'Content 2', concept: false, createdAt: new Date('2024-01-02'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
    ];

    postService.getAllPosts.and.returnValue(of(mockPosts)); // Mock de return waarde van getAllPosts

    // Act
    component.ngOnInit();

    // Assert
    expect(postService.getAllPosts).toHaveBeenCalled();
    expect(component.filteredData).toEqual(mockPosts);
    expect(component.conceptPosts.length).toBe(1); // 1 post moet concept zijn
    expect(component.publishedPosts.length).toBe(1); // 1 post moet gepubliceerd zijn
  });

  it('should handle filter and update filteredData and split posts', () => {
    const mockPosts: Post[] = [
      {
        id: 1, title: 'Post 1', content: 'Content 1', concept: true, createdAt: new Date('2024-01-01'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2, title: 'Post 2', content: 'Content 2', concept: false, createdAt: new Date('2024-01-02'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
    ];

    const mockFilter: Filter = { title: 'Post 1', author: '', content: '', category: '', createdAt: null };

    postService.filterPosts.and.returnValue(of(mockPosts)); // Mock de return waarde van filterPosts

    // Act
    component.handleFilter(mockFilter);

    // Assert
    expect(postService.filterPosts).toHaveBeenCalledWith(mockFilter);
    expect(component.filteredData).toEqual(mockPosts);
    expect(component.conceptPosts.length).toBe(1); // 1 post moet concept zijn
    expect(component.publishedPosts.length).toBe(1); // 1 post moet gepubliceerd zijn
  });

  it('should call splitPostsByConcept when data is received from fetchData', () => {
    const mockPosts: Post[] = [
      {
        id: 1, title: 'Post 1', content: 'Content 1', concept: true, createdAt: new Date('2024-01-01'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2, title: 'Post 2', content: 'Content 2', concept: false, createdAt: new Date('2024-01-02'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
    ];

    spyOn(component, 'splitPostsByConcept'); // Spioneren op splitPostsByConcept

    postService.getAllPosts.and.returnValue(of(mockPosts)); // Mock de return waarde van getAllPosts

    // Act
    component.fetchData();

    // Assert
    expect(component.splitPostsByConcept).toHaveBeenCalledWith(mockPosts);
  });

  it('should split posts by concept correctly', () => {
    const mockPosts: Post[] = [
      {
        id: 1, title: 'Post 1', content: 'Content 1', concept: true, createdAt: new Date('2024-01-01'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2, title: 'Post 2', content: 'Content 2', concept: false, createdAt: new Date('2024-01-02'),
        author: '',
        category: '',
        updatedAt: new Date('2024-01-01')
      },
    ];

    // Act
    component.splitPostsByConcept(mockPosts);

    // Assert
    expect(component.conceptPosts.length).toBe(1); // Er moet 1 concept post zijn
    expect(component.publishedPosts.length).toBe(1); // Er moet 1 gepubliceerde post zijn
    expect(component.conceptPosts[0].id).toBe(1); // De concept post moet ID 1 hebben
    expect(component.publishedPosts[0].id).toBe(2); // De gepubliceerde post moet ID 2 hebben
  });
});
