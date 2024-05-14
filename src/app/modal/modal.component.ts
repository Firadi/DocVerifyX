import { Component, ElementRef, Input, ViewChild, inject, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DragDropDirective, FileHandle } from '../directives/drag-drop.directive';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExtractFileService } from '../services/extract-file.service';

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	templateUrl: "./modal.component.html",
	styleUrl: './modal.component.scss',
	imports: [DragDropDirective, NgIf, NgFor, RouterLink, NgClass, FormsModule],
	
})
export class ModalComponent {

	constructor(private fileTransferService: ExtractFileService, private sanitizer: DomSanitizer,  private http: HttpClient) {}

	@Input() name: string;
	@Input() imageUrl: string = null;
	@ViewChild('imageUrlInput') imageUrlInput: ElementRef;
  	activeModal = inject(NgbActiveModal);
  	file: FileHandle | null = null;
  	test = true;

	loadImageFromUrl(){
		this.imageUrl = this.imageUrlInput.nativeElement.value;
		if (this.imageUrl !== "") {
			this.http.get(this.imageUrl, { responseType: 'blob' }).subscribe(
				(blob: Blob) => {
				  // Create a new File instance from the fetched Blob
				  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
		  
				  // Create a SafeUrl for displaying the image
				  const url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
		  
				  // Assign the FileHandle object to the 'file' variable
				  this.file = { file: file, url: url };
				},
				(error) => {
				  console.error('Error fetching image:', error);
				}
			  );
		}
	}
	sendFile(): void {
		if (this.file) {
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
