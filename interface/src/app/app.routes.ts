import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { HomeComponent } from './Components/home/home.component';
import { PlayComponent } from './Components/play/play.component';
import { SiwaComponent } from './Components/siwa/siwa.component';
import { MapComponent } from './Components/map/map.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'play', component: PlayComponent },
  {path:'siwa',component:SiwaComponent},
  {path:'map', component:MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
