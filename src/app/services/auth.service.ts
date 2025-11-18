import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated = signal<boolean>(false);

  constructor() {}
  
  login(usuario: string, clave: string): boolean {
    if (usuario === 'administrador' && clave === 'qwerty1234') {
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.set(false);
  }
}