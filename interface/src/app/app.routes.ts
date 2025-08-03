import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
<<<<<<< HEAD
import { MapComponent } from './Components/map/map.component';
import { PlayComponent } from './Components/play/play.component';
import { RegisterComponent } from './Components/register/register.component';
import { SiwaComponent } from './Components/siwa/siwa.component';
=======
import { LeaderboardComponent } from './Components/leaderboard/leaderboard.component';
>>>>>>> 4c39f1a88de821aaebabd9e76724891357ea4cb4

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'play', component: PlayComponent },
  {path:'siwa',component:SiwaComponent},
  {path:'map', component:MapComponent},
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'leaderboard', component:LeaderboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
