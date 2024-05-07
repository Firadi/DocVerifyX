import { Component } from '@angular/core';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  selectButton(id: string) {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
      button.classList.remove('selected');
    });
    const buttonElement = document.getElementById(id);
    if (buttonElement) {
      buttonElement.classList.add('selected');
    }
  }
}
