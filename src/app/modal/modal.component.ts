import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropDirective, FileHandle } from '../drag-drop.directive';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExtractFileService } from '../extract-file.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: "./modal.component.html",
	styleUrl: './modal.component.scss',
	imports: [DragDropDirective, NgIf, NgFor, RouterLink, NgClass],
	
})
export class ModalComponent {

	constructor(private fileTransferService: ExtractFileService, private sanitizer: DomSanitizer) {}

	@Input() name: string;
  	activeModal = inject(NgbActiveModal);
  	file: FileHandle | null = null;
  	test = true;

	sendFile(): void {
		if (this.file) {
			//this.fileTransferService.extractAndSendFile();
			this.fileTransferService.sendFile(this.file);
			this.activeModal.dismiss('Cross click');
		}
	}

  	filesDropped(files: FileHandle[]): void {
    	this.file = files[0];
  	}
	fileBrowsed(event: Event): FileHandle | boolean{
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			const allowedTypes = ['image/jpeg', 'image/png']; 
			const selectedFile = files[0];
			if (allowedTypes.includes(selectedFile.type)) {
				const url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(selectedFile));
				const fileHandle =  { file:selectedFile, url: url};
				this.file = fileHandle;
			} else console.log('File type not supported:', selectedFile.type);
						
		}
		return false;
	}
}
