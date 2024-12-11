import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListPublishedComponent } from './post-list-published.component';

describe('PostListPublishedComponent', () => {
  let component: PostListPublishedComponent;
  let fixture: ComponentFixture<PostListPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListPublishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
