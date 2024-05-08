import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: "./modal.component.html",
	styleUrl: './modal.component.scss',
})
export class ModalComponent {
  activeModal = inject(NgbActiveModal);

	@Input() name: string;
}
