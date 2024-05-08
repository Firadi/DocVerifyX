import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropDirective, FileHandle } from '../drag-drop.directive';
import { NgFor, NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: "./modal.component.html",
	styleUrl: './modal.component.scss',
	imports: [DragDropDirective, NgIf, NgFor]
})
export class ModalComponent {
  activeModal = inject(NgbActiveModal);
  @Input() name: string;
  files: FileHandle[] = [];
  test = true;

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
}
