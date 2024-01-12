import { Routes } from '@angular/router';
import { BrowserComponent } from './components/main/browser/browser.component';
import { DatasetsComponent } from './components/main/datasets/datasets.component';
import { FeaturesComponent } from './components/main/features/features.component';
import { HomeComponent } from './components/main/home/home.component';
import { MapComponent } from './components/main/map/map.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'browser', component: BrowserComponent },
  { path: 'datasets', component: DatasetsComponent },
  { path: 'features', component: FeaturesComponent }
];

