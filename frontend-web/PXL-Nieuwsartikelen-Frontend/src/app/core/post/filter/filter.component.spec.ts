import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './filter.component';
import { Filter } from '../../../shared/models/filter.model';
import { By } from '@angular/platform-browser';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent, FormsModule], // Import FormsModule for form support
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default filter values', () => {
    expect(component.filter).toEqual({
      title: '',
      author: '',
      content: '',
      category: '',
      createdAt: null,
    });
  });


  it('should not emit filterChanged event on form submit with invalid form', () => {
    // Arrange
    spyOn(component.filterChanged, 'emit');
    const form = { valid: false, value: {} };

    // Act
    component.onSubmit(form as any);

    // Assert
    expect(component.filterChanged.emit).not.toHaveBeenCalled();
  });
  it('should emit filterChanged event on form submit with valid form', () => {
    // Arrange: Spioneren op de emit-methode van filterChanged
    spyOn(component.filterChanged, 'emit');

    // Voorbeeldformulier met de nodige waarde
    const form = { valid: true, value: { createdAt: '2023-12-04' } };

    // Stel de filterwaarden in
    component.filter.title = 'Test Title';
    component.filter.author = 'Test Author';
    component.filter.content = 'Test Content';
    component.filter.category = 'Test Category';

    // Act: Voer de onSubmit-methode uit met het formulier
    component.onSubmit(form as any);  // Cast naar 'any' omdat 'form' een custom type is

    // Assert: Controleer of de emit-methode is aangeroepen met het juiste object
    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      title: 'test title',     // De titel moet in kleine letters zijn
      author: 'test author',   // De auteur moet in kleine letters zijn
      content: 'test content', // De inhoud moet in kleine letters zijn
      category: 'test category', // De categorie moet in kleine letters zijn
      createdAt: new Date('2023-12-04'), // De datum wordt meegegeven zoals in het formulier
    });
  });

  it('should convert input fields to lowercase before emitting filter', () => {
    // Arrange
    const form = { valid: true, value: { createdAt: '2023-12-04' } };

    component.filter.title = 'UPPER CASE TITLE';
    component.filter.author = 'UPPER CASE AUTHOR';
    component.filter.content = 'UPPER CASE CONTENT';
    component.filter.category = 'UPPER CASE CATEGORY';

    // Act
    component.onSubmit(form as any);

    // Assert
    expect(component.filter.title).toBe('upper case title');
    expect(component.filter.author).toBe('upper case author');
    expect(component.filter.content).toBe('upper case content');
    expect(component.filter.category).toBe('upper case category');
  });
});
