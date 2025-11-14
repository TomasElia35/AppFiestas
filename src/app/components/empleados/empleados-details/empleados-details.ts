import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadosService } from '../../../services/empleados-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { EmpleadosModel } from '../../../models/empleados-model';

@Component({
  selector: 'app-empleados-details',
  standalone: true,
  imports: [],
  templateUrl: './empleados-details.html',
  styleUrl: './empleados-details.css',
})
export class EmpleadosDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly client = inject(EmpleadosService);
  
  private readonly empleadoId = signal<string | number>(this.route.snapshot.params['id']);
  public readonly empleado = toSignal<EmpleadosModel | undefined>(this.client.getEmpleado(this.empleadoId()));
}
