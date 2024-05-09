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

  constructor(
    private fileTransferService: ExtractFileService,
    private router: Router,
  ){}
  file:FileHandle | null = null; 

  ngOnInit(): void {
    this.fileTransferService.file$.subscribe(file => {
      this.file = file;
      if (this.file === null) this.router.navigate(['']);
      
      // extracting file here
    });
  }
}
