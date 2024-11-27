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

  formatDateToBelgian(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.filter.title = this.filter.title.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      this.filter.content = this.filter.content.toLowerCase();
      this.filter.category = this.filter.category.toLowerCase();
      if (this.filter.createdAt) {
        const dateString = this.formatDateToBelgian(this.filter.createdAt);
        this.filter.createdAt = new Date(dateString.split('/').reverse().join('-'));
      }

      this.filterChanged.emit(this.filter);
    }
  }
}
