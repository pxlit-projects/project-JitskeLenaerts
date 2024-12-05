import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component'; 
import { FormsModule } from '@angular/forms';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let filterChangedSpy: jasmine.Spy;  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent, FormsModule],  
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;

    filterChangedSpy = spyOn(component.filterChanged, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged event on form submit with valid form', () => {
    component.filter.title = 'Test Title';
    component.filter.author = 'Test Author';
    component.filter.content = 'Test Content';
    component.filter.category = 'Test Category';
    component.filter.createdAt = new Date(); 

    const mockForm = { valid: true, value: component.filter };
    component.onSubmit(mockForm);

    expect(filterChangedSpy).toHaveBeenCalledWith(component.filter);
  });

  it('should not emit filterChanged event on form submit with invalid form', () => {
    const mockForm = { valid: false, value: component.filter };
    component.onSubmit(mockForm);

    expect(filterChangedSpy).not.toHaveBeenCalled();
  });
});
