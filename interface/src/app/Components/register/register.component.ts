// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

constructor(private authService: AuthService, private router: Router) { }


  onRegister(): void {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        console.log('Registration successful', response);
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Registration failed', error);
        // Handle registration error (e.g., show error message)
      }
    );
  }
}
