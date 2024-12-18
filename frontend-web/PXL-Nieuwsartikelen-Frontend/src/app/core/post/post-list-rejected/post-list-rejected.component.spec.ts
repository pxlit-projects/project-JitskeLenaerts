import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListRejectedComponent } from './post-list-rejected.component';

describe('PostListRejectedComponent', () => {
  let component: PostListRejectedComponent;
  let fixture: ComponentFixture<PostListRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListRejectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
