import { Component, Input } from '@angular/core';
import { ZoomImageDirective } from '../../directives/zoom-image.directive';
import { FileHandle } from '../../directives/drag-drop.directive';

@Component({
  selector: 'app-image-box-controll',
  standalone: true,
  imports: [ZoomImageDirective],
  templateUrl: './image-box-controll.component.html',
  styleUrl: './image-box-controll.component.scss'
})
export class ImageBoxControllComponent {
  @Input() file:FileHandle | null = null;
}
