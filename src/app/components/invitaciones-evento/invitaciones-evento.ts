import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmpleadosService } from '../../services/empleados-service';
import { EmpleadosModel } from '../../models/empleados-model';

@Component({
  selector: 'app-invitaciones-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './invitaciones-evento.html',
  styleUrl: './invitaciones-evento.css'
})
export class InvitacionesEventoComponent {
  private empleadosService = inject(EmpleadosService);

  public documentoInput = signal('');
  public empleado = signal<EmpleadosModel | null>(null);
  public qrUrl = signal<string | null>(null);
  public mensaje = signal('');
  public cargando = signal(false);

  buscarInvitacion() {
    const doc = this.documentoInput();

    if (!doc) {
      this.mensaje.set('Por favor, ingresa tu documento.');
      return;
    }

    this.cargando.set(true);
    this.mensaje.set('');
    this.empleado.set(null);
    this.qrUrl.set(null);

    this.empleadosService.buscarPorDocumento(doc).subscribe({
      next: (empleados) => {
        if (empleados.length > 0) {
          const emp = empleados[0];
          this.empleado.set(emp);
      
          this.qrUrl.set(`qrcodes/${emp.documento}.png`);
        } else {
          this.mensaje.set('No se encontró invitación con este documento.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set('Error de conexión. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }
}