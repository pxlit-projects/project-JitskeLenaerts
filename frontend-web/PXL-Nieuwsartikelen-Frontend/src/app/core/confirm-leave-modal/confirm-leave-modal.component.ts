import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-leave-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-leave-modal.component.html',
  styleUrl: './confirm-leave-modal.component.css'
})
export class ConfirmLeaveModalComponent {
  @Output() confirmLeave = new EventEmitter<boolean>();

  onCancel(): void {
    this.confirmLeave.emit(false);
  }

  onConfirm(): void {
    this.confirmLeave.emit(true);
  }
}