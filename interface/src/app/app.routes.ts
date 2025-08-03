import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { HomeComponent } from './Components/home/home.component';
import {
  LeaderboardComponent,
} from './Components/leaderboard/leaderboard.component';
import { LoginComponent } from './Components/login/login.component';
import { MapComponent } from './Components/map/map.component';
import { PlayComponent } from './Components/play/play.component';
import { RegisterComponent } from './Components/register/register.component';
import { SiwaComponent } from './Components/siwa/siwa.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'play', component: PlayComponent },
  {path:'siwa',component:SiwaComponent},
  {path:'map', component:MapComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'leaderboard', component:LeaderboardComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
