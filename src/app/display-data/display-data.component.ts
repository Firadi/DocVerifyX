import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractFileService } from '../extract-file.service';
import { FileHandle } from '../directives/drag-drop.directive';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgClass, NgIf } from '@angular/common';
import { ZoomImageDirective } from '../directives/zoom-image.directive';



@Component({
  selector: 'app-display-data',
  standalone: true,
  imports: [RouterLink, MatProgressSpinnerModule, NgIf, ZoomImageDirective, NgClass],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.scss'
})
export class DisplayDataComponent {
  data: any;
  dataLoaded:boolean;
  dataLoadedError:boolean;
  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;

  constructor(
    private fileTransferService: ExtractFileService,
    private router: Router,
    private clipboard: Clipboard
  ){}

  file:FileHandle | null = null; 
  
  ngOnInit(): void {
    this.fileTransferService.file$.subscribe(file => {
      this.file = file;
      if (this.file === null) this.router.navigate([''])
      else this.extractFileData();
    });

  }
  @HostListener('document:keydown.a', ['$event'])
  @HostListener('document:keydown.A', ['$event'])
  handleShortcut(event: KeyboardEvent) {
    event.preventDefault(); 
    this.copyAsTabSeparateValues();
  }
  extractFileData(): void {
    this.dataLoaded = false;
    this.fileTransferService.extractFile(this.file).subscribe(
      (response) => {
        console.log('Image uploaded successfully:', response);
        this.data = response;
        this.dataLoaded = true;
        // Handle the response data as needed
      },
      (error) => {
        this.dataLoadedError = true;
        console.error('Error occurred while uploading the image:', error);
        // Handle the error appropriately
      }
    );
    
  }
  downloadJson() {
    // Initialize an object to store input values
    const data = {};

    // Loop through all input elements
    this.inputElements.forEach(inputElement => {
      // Get the input's id and value and add it to the data object
      const id = inputElement.nativeElement.id;
      const value = inputElement.nativeElement.value;
      data[id] = value;
      
    });
    // Convert object to JSON string
    const jsonData = JSON.stringify(data);

    // Create Blob and initiate download (same as previous examples)
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  copyAsTabSeparateValues(){
    const data = {};

    // Loop through all input elements
    this.inputElements.forEach(inputElement => {
      
      const id = inputElement.nativeElement.id;
      const value = inputElement.nativeElement.value;
      data[id] = value;
      
    });
    console.log(data);

    let textToCopy = "";
    textToCopy = textToCopy.concat(
      data["last-name"],"\t",
      data["first-name"],"\t",
      data["date-of-birth"],"\t",
      data["passport-number"],"\t",
      data["date-of-issuance"],"\t",
      data["date-of-expiry"],"\t",
      data["place-of-birth"]
    );
    this.clipboard.copy(textToCopy);
    
    
  }
}
