import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedReviewCheckComponent } from './submitted-review-check.component';

describe('SubmittedReviewCheckComponent', () => {
  let component: SubmittedReviewCheckComponent;
  let fixture: ComponentFixture<SubmittedReviewCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedReviewCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmittedReviewCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
