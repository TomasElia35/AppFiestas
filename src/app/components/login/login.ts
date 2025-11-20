import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = signal('');
  clave = signal('');
  error = signal('');

  ingresar() {
    if (this.authService.login(this.usuario(), this.clave())) {
      this.error.set('');
      this.router.navigate(['/home']); 
    } else {
      this.error.set('Usuario o contraseña incorrectos.');
    }
  }

  volverAlInicio() {
    this.router.navigate(['/']);
  }

}