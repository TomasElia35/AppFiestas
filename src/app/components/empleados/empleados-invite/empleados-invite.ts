import { Component, inject, signal } from '@angular/core';
import { EmpleadosService } from '../../../services/empleados-service';
import { EmpleadosModel } from '../../../models/empleados-model';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { ZXingScannerModule } from '@zxing/ngx-scanner'; 
import { Router } from '@angular/router'; // 👈 1. Importar el Router

@Component({
  selector: 'app-empleados-invite',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule, 
    ZXingScannerModule 
  ],
  templateUrl: './empleados-invite.html',
  styleUrl: './empleados-invite.css',
})
export class EmpleadosInvite {
  private empleadosService = inject(EmpleadosService);
  private router = inject(Router); // 👈 2. Inyectar el Router

  
  public modo = signal<'escanear' | 'manual'>('escanear');
  public documentoManual = signal('');
  public cargando = signal(false);

  // --- Estados del Escáner ---
  public scannerEnabled = signal(true); 
  public devices = signal<MediaDeviceInfo[]>([]);
  public currentDevice = signal<MediaDeviceInfo | undefined>(undefined);

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.devices.set(devices);
    if (devices && devices.length > 0) {
      const trasera = devices.find(d => /back|environment/i.test(d.label));
      this.currentDevice.set(trasera || devices[0]);
    }
  }

  onCameraChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const deviceId = target.value;
    const device = this.devices().find(d => d.deviceId === deviceId);
    this.currentDevice.set(device);
  }

  onScanSuccess(evento: any) { 
    if (this.cargando()) return; // Evitar doble escaneo
    this.cargando.set(true);
    // this.resetearEstado(); // Ya no es necesario

    let textoQR: string = '';

    if (typeof evento === 'string') {
      textoQR = evento;
    } else if (evento && typeof evento.text === 'string') {
      textoQR = evento.text;
    } else if (evento && typeof evento.getText === 'function') {
      textoQR = evento.getText();
    } else {
      console.error('El formato del evento de escaneo es desconocido:', evento);
      this.router.navigate(['/resultado', 'error']); // 👈 Navegar a error
      this.cargando.set(false);
      return;
    }

    console.log('Resultado QR (limpio):', textoQR);
    const textoLimpio = textoQR.trim();
    const partes = textoLimpio.split(',');

    if (partes.length !== 2) {
      this.router.navigate(['/resultado', 'error']); // 👈 Navegar a error
      this.cargando.set(false);
      return;
    }

    const [documento, token] = partes;
    this.validarEmpleado(documento, token);
  }

  buscarManualmente() {
    if (this.cargando()) return;
    this.cargando.set(true);
    const doc = this.documentoManual();

    if (!doc) {
      this.cargando.set(false);
      // Opcional: manejar mensaje de campo vacío (aunque ahora no hay dónde mostrarlo)
      return;
    }

    this.empleadosService.buscarPorDocumento(doc).subscribe({
      next: (empleados) => {
        if (empleados.length > 0) {
          const empleado = empleados[0];
          if (empleado.Asistio) {
            this.router.navigate(['/resultado', 'asistido'], { queryParams: { nombre: empleado.nombre } });
          } else {
            this.marcarAsistencia(empleado); // Marcar asistencia y LUEGO navegar
          }
        } else {
          this.router.navigate(['/resultado', 'error']);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.router.navigate(['/resultado', 'error']);
        this.cargando.set(false);
      }
    });
  }

  private validarEmpleado(documento: string, token: string) {
    this.empleadosService.validarEmpleado(documento, token).subscribe({
      next: (empleados) => {
        if (empleados.length > 0) {
          const empleado = empleados[0];
          if (empleado.Asistio) {
            this.router.navigate(['/resultado', 'asistido'], { queryParams: { nombre: empleado.nombre } });
          } else {
            this.marcarAsistencia(empleado); // Marcar asistencia y LUEGO navegar
          }
        } else {
          this.router.navigate(['/resultado', 'error']);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.router.navigate(['/resultado', 'error']);
        this.cargando.set(false);
      }
    });
  }
  
  // 👇 4. Modificar `marcarAsistencia` para que acepte un empleado
  marcarAsistencia(empleado: EmpleadosModel) {
    if (!empleado) return; // Chequeo de seguridad

    this.cargando.set(true); // Asegurarse que sigue cargando
    
    const empleadoActualizado = {
      ...empleado,
      Asistio: true,
      fechaAsistida: new Date()
    };

    this.empleadosService.updateEmpleado(empleadoActualizado).subscribe({
      next: (empleadoRespuesta) => {
        // 👇 5. Navegar a éxito
        this.router.navigate(['/resultado', 'exito'], { queryParams: { nombre: empleadoRespuesta.nombre } });
        this.cargando.set(false);
      },
      error: () => {
        this.router.navigate(['/resultado', 'error']); // 👈 Navegar a error
        this.cargando.set(false);
      }
    });
  }

  // --- Métodos de utilidad ---
  cambiarModo(nuevoModo: 'escanear' | 'manual') {
    this.modo.set(nuevoModo);
    this.cargando.set(false);
    this.documentoManual.set('');
  }

}