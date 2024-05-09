import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Directive({
  selector: "[appDragDrop]",
  standalone: true,
})
export class DragDropDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  @HostBinding("style.background") private background = "#eee";

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#edfaff";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  
    let files: FileHandle[] = [];
    console.log(evt.dataTransfer.files);
    for (let i = 0; i < 1/*evt.dataTransfer.files.length*/; i++) {
      const file = evt.dataTransfer.files[i];
      if (this.validateFile(file.type)) {
        const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        files.push({ file, url });
      }
      else console.log('File type not supported:', file.type);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
    
  }
  private validateFile(fileType: string): boolean {
    // Check if the file type is image
    return fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpj';
  }
}
