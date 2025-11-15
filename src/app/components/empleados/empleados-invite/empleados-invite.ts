import { Component, inject, signal } from '@angular/core';
import { EmpleadosService } from '../../../services/empleados-service';
import { EmpleadosModel } from '../../../models/empleados-model';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Importar el escáner

@Component({
  selector: 'app-empleados-invite',
  standalone: true, // Asegurarse que es standalone
  imports: [
    CommonModule, // Añadir CommonModule
    FormsModule, // Añadir FormsModule
    ZXingScannerModule // Añadir ZXingScannerModule
  ],
  templateUrl: './empleados-invite.html',
  styleUrl: './empleados-invite.css',
})
export class EmpleadosInvite {
  private empleadosService = inject(EmpleadosService);

  // --- Estados del Componente ---
  // Almacena el empleado encontrado
  public empleadoEncontrado = signal<EmpleadosModel | null>(null);
  // Controla el modo (escanear o manual)
  public modo = signal<'escanear' | 'manual'>('escanear');
  // Almacena el DNI para la búsqueda manual
  public documentoManual = signal('');
  // Mensajes de estado (éxito, error, etc.)
  public mensaje = signal('');
  // Estado de carga
  public cargando = signal(false);

/**
   * Se dispara cuando el escáner QR lee un código con éxito.
   * Esta versión es más robusta para manejar diferentes tipos de eventos de escaneo.
   */
  onScanSuccess(evento: any) { // 1. Cambiamos el tipo a 'any'
    this.cargando.set(true);
    this.resetearEstado();

    let textoQR: string = '';

    // 2. Lógica para extraer el texto de forma segura
    if (typeof evento === 'string') {
      textoQR = evento;
    } else if (evento && typeof evento.text === 'string') {
      textoQR = evento.text;
    } else if (evento && typeof evento.getText === 'function') {
      textoQR = evento.getText();
    } else {
      // Si no podemos encontrar el texto, fallamos.
      console.error('El formato del evento de escaneo es desconocido:', evento);
      this.mensaje.set('Error: No se pudo leer el QR. Formato inesperado.');
      this.cargando.set(false);
      return;
    }

    console.log('Resultado QR (limpio):', textoQR);

    // 3. Limpiamos el texto antes de dividirlo
    const textoLimpio = textoQR.trim();
    const partes = textoLimpio.split(',');

    if (partes.length !== 2) {
      this.mensaje.set('Error: El formato del QR no es válido.');
      this.cargando.set(false);
      return;
    }

    const [documento, token] = partes;
    this.validarEmpleado(documento, token);
  }

  /**
   * Se dispara al buscar manualmente.
   */
  buscarManualmente() {
    this.cargando.set(true);
    this.resetearEstado();
    const doc = this.documentoManual();

    if (!doc) {
      this.mensaje.set('Por favor, ingrese un documento.');
      this.cargando.set(false);
      return;
    }

    this.empleadosService.buscarPorDocumento(doc).subscribe({
      next: (empleados) => {
        if (empleados.length > 0) {
          this.empleadoEncontrado.set(empleados[0]);
          this.verificarAsistencia(empleados[0]);
        } else {
          this.mensaje.set('Empleado no encontrado con ese documento.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set('Error al conectar con el servidor.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Lógica de validación centralizada (usada por el escáner).
   */
  private validarEmpleado(documento: string, token: string) {
    this.empleadosService.validarEmpleado(documento, token).subscribe({
      next: (empleados) => {
        if (empleados.length > 0) {
          // ¡Validación exitosa!
          this.empleadoEncontrado.set(empleados[0]);
          this.verificarAsistencia(empleados[0]);
        } else {
          // Combinación DNI/Token incorrecta
          this.mensaje.set('Invitación no válida o incorrecta.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set('Error al conectar con el servidor.');
        this.cargando.set(false);
      }
    });
  }

  /**
   * Comprueba si el empleado ya asistió y actualiza el mensaje.
   */
  private verificarAsistencia(empleado: EmpleadosModel) {
    if (empleado.Asistio) {
      this.mensaje.set(` Este empleado (${empleado.nombre}) ya registró su asistencia.`);
    } else {
      this.mensaje.set(` ¡Bienvenido/a ${empleado.nombre}!`);
    }
  }

  /**
   * Marca la asistencia del empleado encontrado.
   */
  marcarAsistencia() {
    const empleado = this.empleadoEncontrado();
    if (!empleado || empleado.Asistio) {
      return;
    }

    this.cargando.set(true);
    
    // Creamos una copia actualizada del empleado
    const empleadoActualizado = {
      ...empleado,
      Asistio: true,
      fechaAsistida: new Date()
    };

    this.empleadosService.updateEmpleado(empleadoActualizado).subscribe({
      next: (empleadoRespuesta) => {
        // Actualizamos el estado local con la respuesta del servidor
        this.empleadoEncontrado.set(empleadoRespuesta);
        this.mensaje.set(`¡Asistencia registrada para ${empleadoRespuesta.nombre}!`);
        this.cargando.set(false);
      },
      error: () => {
        this.mensaje.set('Error al registrar la asistencia.');
        this.cargando.set(false);
      }
    });
  }

  // --- Métodos de utilidad ---

  cambiarModo(nuevoModo: 'escanear' | 'manual') {
    this.modo.set(nuevoModo);
    this.resetearEstado();
    this.documentoManual.set('');
  }

  resetearEstado() {
    this.empleadoEncontrado.set(null);
    this.mensaje.set('');
  }

  escanearDeNuevo() {
    this.resetearEstado();
  }
}