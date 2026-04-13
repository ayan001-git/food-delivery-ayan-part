import { Routes } from '@angular/router';
import { Restaurants } from './restaurants/restaurants';
import { Menu } from './menu/menu';

export const routes: Routes = [
  { path: '', component: Restaurants },
  { path: 'menu/:id', component: Menu }
];