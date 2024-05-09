import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropDirective, FileHandle } from '../drag-drop.directive';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExtractFileService } from '../extract-file.service';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: "./modal.component.html",
	styleUrl: './modal.component.scss',
	imports: [DragDropDirective, NgIf, NgFor, RouterLink]
})
export class ModalComponent {

	
	constructor(private fileTransferService: ExtractFileService){}
	@Input() name: string;
  	activeModal = inject(NgbActiveModal);
  	file: FileHandle = null;
  	test = true;

	sendFile(): void {
		if (this.file) {
			this.fileTransferService.sendFile(this.file);
			this.activeModal.dismiss('Cross click');
		}
	}

  	filesDropped(files: FileHandle[]): void {
    	this.file = files[0];
  	}
}
