import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractFileService } from '../extract-file.service';
import { FileHandle } from '../directives/drag-drop.directive';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NgIf } from '@angular/common';
import { ZoomImageDirective } from '../directives/zoom-image.directive';



@Component({
  selector: 'app-display-data',
  standalone: true,
  imports: [RouterLink, MatProgressSpinnerModule, NgIf, ZoomImageDirective],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.scss'
})
export class DisplayDataComponent {
  data: any;
  dataLoaded:boolean;
  dataLoadedError:boolean;

  constructor(
    private fileTransferService: ExtractFileService,
    private router: Router,
    
    
  ){}
  file:FileHandle | null = null; 
  
  ngOnInit(): void {
    this.fileTransferService.file$.subscribe(file => {
      this.file = file;
      if (this.file === null) this.router.navigate([''])
      else this.extractFileData();
    });
    
    console.log(this.data);
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
}
