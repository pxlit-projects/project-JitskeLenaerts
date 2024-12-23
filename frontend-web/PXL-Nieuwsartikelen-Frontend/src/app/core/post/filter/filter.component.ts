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
  @Output() filterChanged = new EventEmitter<Filter>();

  filter: Filter = {
    title: '',
    author: '',
    content: '',
    category: '',
    createdAt: null,
  };

  onSubmit(form: any) {
    if (form.valid) {
      this.filter.title = this.filter.title.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      this.filter.content = this.filter.content.toLowerCase();
      this.filter.category = this.filter.category.toLowerCase();
      this.filter.createdAt = form.value.createdAt;
      this.filterChanged.emit(this.filter);
    }
  }
}
