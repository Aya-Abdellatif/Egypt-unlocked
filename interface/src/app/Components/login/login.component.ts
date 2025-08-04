import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

constructor(private authService: AuthService, private router: Router) { }


  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login failed', error);
        // Handle login error (e.g., show error message)
      }
    );
  }
}
