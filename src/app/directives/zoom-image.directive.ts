import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appZoomImage]',
  standalone: true
})
export class ZoomImageDirective {
  
  @Input() width: number = 500;

  @Input() zoomMax: number = 700;

  @Input() zoomMin: number = 100;

  @Input('appZoomImage') zoomDirection: 'zoom-in' | 'zoom-out' | 'rotate-right' | 'rotate-left' = 'zoom-in'; 

  @Input() zoomTarget !: HTMLElement;
  
  constructor() { }

  @HostListener('click') onClick() {
      this.width = parseInt(this.zoomTarget.style.width) ? parseInt(this.zoomTarget.style.width) : 700;
      if (this.zoomDirection === 'zoom-in' && this.zoomMax > this.width ) {
        this.width += 25;
        this.zoom(this.width);
        console.log("in");
      }else if (this.zoomDirection === 'zoom-out' && this.width > this.zoomMin) {
        this.width -= 25;
        this.zoom(this.width);
        console.log("out");
      }else {
        this.rotate(this.zoomDirection)
      }
      
  }

  private zoom(width: number){
    this.zoomTarget.style.width = width + 'px';
  }
  private rotate(direction){
    let currentRotation = parseInt(this.zoomTarget.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
    const rotationIncrement = direction === 'rotate-left' ? 90 : (direction === 'rotate-right')? -90 : false;

    if (rotationIncrement !== false ) {
      const newRotation = currentRotation + rotationIncrement;
      this.zoomTarget.style.transform = `rotate(${newRotation}deg)`;
    }
  }
  

}
