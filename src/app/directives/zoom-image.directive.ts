import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appZoomImage]',
  standalone: true
})
export class ZoomImageDirective {
  
  @Input() width: number = 500;

  @Input() zoomMax: number = 900;

  @Input() zoomMin: number = 250;

  @Input('appZoomImage') zoomDirection: 'zoom-in' | 'zoom-out' | 'rotate-right' | 'rotate-left' = 'zoom-in'; 

  @Input() zoomTarget !: HTMLElement;
  
  constructor() { }

  @HostListener('click') onClick() {
    this.applyZoom();  
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === '+' || event.key === '=') {
      this.zoomIn();
    } else if (event.key === '-' || event.key === '_') {
      this.zoomOut();
    }
  }

  private applyZoom(): void {
    
    if (this.zoomDirection === 'zoom-in' && this.width < this.zoomMax) {
      this.width += 45;
      this.zoom(this.width);
    } else if (this.zoomDirection === 'zoom-out' && this.width > this.zoomMin) {
      this.width -= 45;
      this.zoom(this.width);
    } else {
      this.rotate(this.zoomDirection);
    }
  }

  private zoomIn(): void {
    if (this.width < this.zoomMax) {
      this.width += 45;
      this.zoom(this.width);
    }
  }

  private zoomOut(): void {
    if (this.width > this.zoomMin) {
      this.width -= 45;
      this.zoom(this.width);
    }
  }

  private zoom(width: number): void {
    this.zoomTarget.style.width = `${width}px`;
  }

  private rotate(direction){
    let currentRotation = parseInt(this.zoomTarget.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
    const rotationIncrement = direction === 'rotate-left' ? 90 : (direction === 'rotate-right')? -90 : false;
    this.zoomTarget.style.transformOrigin = "center center";

    if (rotationIncrement !== false ) {
      console.log(this.zoomTarget.style.transformOrigin);

      const newRotation = currentRotation + rotationIncrement;
      this.zoomTarget.style.transform = `rotate(${newRotation}deg)`;
    }
  }
  

}
