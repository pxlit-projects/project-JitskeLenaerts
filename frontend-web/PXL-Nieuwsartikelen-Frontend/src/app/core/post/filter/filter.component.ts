import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../../shared/models/filter.model';


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  filter: Filter = {
    title: '',
    author: '',
    content: '',
    category: '',
    createdAt: null,
  };

  @Output() filterChanged = new EventEmitter<Filter>();


  onSubmit(form: any) {
    if (form.valid) {
      this.filter.title = this.filter.title.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      this.filter.content = this.filter.content.toLowerCase();
      this.filter.category = this.filter.category.toLowerCase();
      if (this.filter.createdAt) {
        this.filter.createdAt = new Date(this.filter.createdAt);
      }
      this.filterChanged.emit(this.filter);
    }
  }
}
