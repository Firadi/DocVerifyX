import { Component, ElementRef, EventEmitter, HostListener, Output, QueryList, ViewChildren } from '@angular/core';
import { ExtractFileService } from '../../services/extract-file.service';
import { Router } from '@angular/router';
import { ExtractDataFromPassportApiService } from '../../services/extract-data-from-passport-api.service';
import { FileHandle } from '../../directives/drag-drop.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './data-form.component.html',
  styleUrl: './data-form.component.scss'
})
export class DataFormComponent {
  myForm: FormGroup; 
  
  @Output() sendFileToParent = new EventEmitter<FileHandle>();
  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;

  @HostListener('document:keydown.a', ['$event'])
  @HostListener('document:keydown.A', ['$event'])
  handleShortcut(event: KeyboardEvent) {
    event.preventDefault(); 
    if (this.myForm.valid) {
      this.copyAsTabSeparateValues();
    }
  }
  file: FileHandle | null = null;
  data: any;
  dataLoaded: boolean;
  dataLoadedError: boolean;
  isFormValid: boolean = false;
  
  constructor(
    private fileTransferService: ExtractFileService,
    private router: Router,
    private clipboard: Clipboard,
    private DataFromPassportService: ExtractDataFromPassportApiService,
    private fb: FormBuilder
  ){
    
  }
  
  ngOnInit(): void {
    this.fileTransferService.file$.subscribe(file => {
      this.file = file;
      this.sendFileToParent.emit(this.file);
      if (this.file === null) {
        this.router.navigate(['']);
      } else {
        this.processPassportImage();
      }
    });
    this.myForm = this.fb.group({
      'date-of-birth':    ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
      'date-of-expiry':   ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
      'date-of-issuance': ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
      'first-name':       ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      'last-name':        ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      'national-id':      ['', [Validators.required, Validators.pattern(/^([A-Za-z]{1,2}\d{5,7})$/)]],
      'passport-number':  ['', [Validators.required, Validators.pattern(/^([A-Za-z]{2}\d{7})$/)]],
      'place-of-birth':   ['', [Validators.required, Validators.minLength(3)]]
    });

    this.myForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });

    this.setFormValues();
  }

  setFormValues() {
    // If data is available, update form controls' values
    if (this.data) {
      this.myForm.patchValue({
        'date-of-birth': this.data['dob'].trim() || '',
        'date-of-expiry': this.data['doe'].trim() || '',
        'date-of-issuance': this.data['doi'].trim() || '',
        'first-name': this.data['firstName'].trim() || '',
        'last-name': this.data['lastName'].trim() || '',
        'national-id': this.data['cin'].trim() || '',
        'passport-number': this.data['Npass'].trim().toUpperCase() || '',
        'place-of-birth':  this.data['prefecture'].trim() || ''
      });
    }
  }

  async processPassportImage() {
    this.dataLoaded = false;
    const file = this.file.file;
    try {
      this.data = await this.DataFromPassportService.main(file);
      this.dataLoaded = true;
      this.setFormValues();
      console.log('Extracted Data:', this.data);
      // Do something with the extracted data
    } catch (error) {
      this.dataLoadedError = true;
      console.error('Error extracting data:', error);
    }
  }

  downloadJson() {
    if (this.isFormValid) {
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
  }

  copyAsTabSeparateValues(){
    if (this.isFormValid) {
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

  isInvalid(controlName: string): boolean {
    const control = this.myForm.get(controlName);
    return control ? control.invalid : false;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.myForm.get(controlName);
    return control ? control.invalid : false;
  }

  getError(controlName: string, errorType: string): boolean {
    const control = this.myForm.get(controlName);
    return control ? control.hasError(errorType) : false;
  }
}
