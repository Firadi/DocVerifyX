import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appZoomImage]',
  standalone: true
})
export class ZoomImageDirective {
  
  @Input() width: number = 500;

  @Input() zoomMax: number = 1000;

  @Input() zoomMin: number = 100;

  @Input('appZoom') zoomDirection: 'in' | 'out' = 'in'; 

  @Input() zoomTarget !: HTMLElement;
  
  constructor() { }

  @HostListener('click') onClick() {
      this.width = parseInt(this.zoomTarget.style.width) ? parseInt(this.zoomTarget.style.width) : 500;
      if (this.zoomDirection === 'in' && this.zoomMax > this.width ) {
        this.width += 25;
        console.log("in");
      }else if (this.zoomDirection === 'out' && this.width > this.zoomMin) {
        this.width -= 25;
        console.log("out");

      }
      this.zoom(this.width);
  }

  private zoom(width: number){
    this.zoomTarget.style.width = width + 'px';
  }
  

}
