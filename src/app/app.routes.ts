import { Routes } from '@angular/router';
import { DisplayDataComponent } from './display-data/display-data.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
    { path: '', component: StartComponent },
    { path: 'verification', component: DisplayDataComponent },
];
