import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado.html',
  styleUrl: './resultado.css',
})
export class ResultadoComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  // Señales para manejar el estado de la UI
  public mensaje = signal('');
  public icono = signal('');
  public claseCss = signal('');
  public submensaje = signal('Redirigiendo en 3 segundos...');

  private timer: any; // Para el temporizador de redirección

  ngOnInit() {
    // 1. Leer los parámetros de la URL
    const status = this.route.snapshot.paramMap.get('status');
    const nombre = this.route.snapshot.queryParamMap.get('nombre');
    
    // 2. Configurar la pantalla según el estado
    this.configurarPantalla(status, nombre);

    // 3. Iniciar el temporizador para volver al escáner
    this.timer = setTimeout(() => {
      this.volver();
    }, 3000); // 3 segundos
  }

  ngOnDestroy() {
    // Limpiar el temporizador si el componente se destruye antes
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /**
   * Configura los mensajes y colores de la pantalla de resultado.
   */
  private configurarPantalla(status: string | null, nombre: string | null) {
    switch (status) {
      case 'exito':
        this.icono.set('✅');
        this.mensaje.set(`¡BIENVENIDO/A, ${nombre!.toUpperCase()}!`);
        this.claseCss.set('exito');
        break;
      case 'asistido':
        this.icono.set('👋');
        this.mensaje.set(`${nombre!.toUpperCase()} YA HABÍA INGRESADO`);
        this.claseCss.set('asistido');
        break;
      default: // 'error' o cualquier otro valor
        this.icono.set('❌');
        this.mensaje.set('INVITACIÓN NO VÁLIDA');
        this.claseCss.set('error');
        this.submensaje.set('Por favor, intente de nuevo.');
        break;
    }
  }

  /**
   * Navega de vuelta a la pantalla de escaneo
   */
  volver() {
    clearTimeout(this.timer); // Detiene el timer si se presiona manualmente
    this.router.navigate(['/escanear-invitacion']);
  }
}