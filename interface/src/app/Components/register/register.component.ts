import { CommonModule } from '@angular/common';
// register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  onRegister(): void {
    this.authService.register(this.username, this.password).subscribe(
      response => {
        console.log('Registration successful', response);
        // Handle successful registration (e.g., navigate to login page)
      },
      error => {
        console.error('Registration failed', error);
        // Handle registration error (e.g., show error message)
      }
    );
  }
}
