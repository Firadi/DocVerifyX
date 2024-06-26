import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StartComponent } from './start/start.component';
import { DisplayDataComponent } from './display-data/display-data.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppComponent, StartComponent, DisplayDataComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Doc-VerifyX';
}
