import { Routes } from '@angular/router';
import { TemperatureEntryComponent } from './features/temperature-entry/temperature-entry.component';

export const routes: Routes = [
  { path: '', component: TemperatureEntryComponent },
  { path: 'entry', component: TemperatureEntryComponent }
];
