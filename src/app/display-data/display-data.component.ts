import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileHandle } from '../directives/drag-drop.directive';
import { ImageBoxControllComponent } from './image-box-controll/image-box-controll.component';
import { DataFormComponent } from './data-form/data-form.component';



@Component({
  selector: 'app-display-data',
  standalone: true,
  imports: [RouterLink, ImageBoxControllComponent, DataFormComponent],
  templateUrl: './display-data.component.html',
  styleUrl: './display-data.component.scss'
})
export class DisplayDataComponent {
  file:FileHandle | null = null; 
}
