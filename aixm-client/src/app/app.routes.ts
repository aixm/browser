import { Routes } from '@angular/router';
import { AboutComponent } from './components/common/pages/about/about.component';
import { ForbiddenComponent } from './components/common/pages/forbidden/forbidden.component';
import { NotFoundComponent } from './components/common/pages/not-found/not-found.component';
import { UsersComponent } from './components/main/admin/users/users.component';
import { BrowserComponent } from './components/main/browser/browser.component';
import { DatasetsComponent } from './components/main/datasets/datasets/datasets.component';
import { FeaturesComponent } from './components/main/features/features/features.component';
import { HomeComponent } from './components/main/home/home.component';
import { MapComponent }          from './components/main/map/map.component';
import { canActivateAdminGuard } from './guards/can-activate-admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'browser', component: BrowserComponent },
  { path: 'datasets', component: DatasetsComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users', component: UsersComponent, canActivate: [canActivateAdminGuard] },
  { path: '**', component: NotFoundComponent },
];

