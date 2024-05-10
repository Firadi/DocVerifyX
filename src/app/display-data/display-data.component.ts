import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractFileService } from '../extract-file.service';
import { FileHandle } from '../drag-drop.directive';
import { Router } from '@angular/router';


@Component({
  selector: 'app-display-data',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.css'
})
export class DisplayDataComponent {
  data: any;

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
    this.fileTransferService.extractFile(this.file).subscribe(
      (response) => {
        console.log('Image uploaded successfully:', response);
        this.data = response;
        // Handle the response data as needed
      },
      (error) => {
        console.error('Error occurred while uploading the image:', error);
        // Handle the error appropriately
      }
    );
    
  }
}
