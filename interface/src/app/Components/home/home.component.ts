import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CitiesComponent } from "../cities/cities.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, CitiesComponent],
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css'] 
})
export class HomeComponent {

}
