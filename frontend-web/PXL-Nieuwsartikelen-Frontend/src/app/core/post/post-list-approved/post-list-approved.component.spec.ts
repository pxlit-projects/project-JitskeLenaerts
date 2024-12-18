import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListApprovedComponent } from './post-list-approved.component';

describe('PostListApprovedComponent', () => {
  let component: PostListApprovedComponent;
  let fixture: ComponentFixture<PostListApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListApprovedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
