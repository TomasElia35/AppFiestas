import { Component, computed, inject, signal } from '@angular/core';
import { EmpleadosService } from '../../../services/empleados-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empleados-list.html',
  styleUrl: './empleados-list.css',
})
export class EmpleadosList {

  private readonly client = inject(EmpleadosService);
  private readonly empleados = toSignal(this.client.getEmpleados());
  private readonly router = inject(Router);
  protected readonly isLoading = computed(() => this.empleados() === undefined);
  public filtroNombre = signal('');
  public filtroAsistio = signal('todos');

  public filteredEmpleados = computed(() => {
    const empleados = this.empleados();
    const nombre = this.filtroNombre();
    const asistio = this.filtroAsistio();

    if (!empleados) {
      return [];
    }

    return empleados.filter(empleado => {
      const nombreMatch = empleado.nombre.toLowerCase().includes(nombre.toLowerCase());
      const asistioMatch = asistio === 'todos' || (asistio === 'asistio' && empleado.Asistio) || (asistio === 'no-asistio' && !empleado.Asistio);
      return nombreMatch && asistioMatch;
    });
  });
  navigateToDetails(id: string | number) {
    this.router.navigateByUrl(`details/${id}`);
  }
}
