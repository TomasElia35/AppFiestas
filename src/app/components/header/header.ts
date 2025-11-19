import { Component, inject } from '@angular/core'; // Importar inject
import { RouterLink, Router } from '@angular/router'; // Importar Router
import { AuthService } from '../../services/auth.service'; // Importar AuthService
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public authService = inject(AuthService); 
  private router = inject(Router);

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
  menuStaff(){
    this.router.navigate(['/home']);
  }
}