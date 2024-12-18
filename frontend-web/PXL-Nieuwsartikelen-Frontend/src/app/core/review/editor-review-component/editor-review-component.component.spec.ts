import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorReviewComponentComponent } from './editor-review-component.component';

describe('EditorReviewComponentComponent', () => {
  let component: EditorReviewComponentComponent;
  let fixture: ComponentFixture<EditorReviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorReviewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorReviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
