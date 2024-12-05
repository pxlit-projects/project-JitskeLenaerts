import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

class MockPostService {
  getPostById(id: number) {
    return of({
      id,
      title: 'Test Post',
      author: 'Test Author',
      content: 'Test Content',
      category: 'Test Category',
      concept: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PostDetailComponent, 
        CommonModule,
        RouterModule.forRoot([]), 
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks(), 
        { provide: PostService, useClass: MockPostService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }, 
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); 
    activatedRoute = TestBed.inject(ActivatedRoute); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to edit page when goToEditPage is called', () => {
    spyOn(router, 'navigate'); 

    component.goToEditPage(1);

    expect(router.navigate).toHaveBeenCalledWith(['/edit', 1]);
  });

  it('should call fetchPost on init', () => {
    spyOn(component, 'fetchPost'); 
    component.ngOnInit();

    expect(component.fetchPost).toHaveBeenCalledWith(1);
  });
});
