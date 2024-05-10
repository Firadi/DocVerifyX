import { Component, inject, TemplateRef } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-start',
  standalone: true,
  imports: [NgbDatepickerModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

  
  constructor(private modalService: NgbModal = inject(NgbModal)) {
    this.modalService.open(ModalComponent, { size: 'xl', centered: true, modalDialogClass: 'bg' })
  }

	open() {
		const modalRef = this.modalService.open(ModalComponent, { size: 'xl', centered: true, modalDialogClass: 'bg' });
		modalRef.componentInstance.name = 'World';
	}
  
 
  selectButton(id: string) {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
      button.classList.remove('selected');
    });
    const buttonElement = document.getElementById(id);
    if (buttonElement) {
      buttonElement.classList.add('selected');
    }
  }


}
