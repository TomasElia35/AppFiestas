import { inject, Injectable } from '@angular/core';
import { Database, ref, listVal, update, query, orderByChild, equalTo } from '@angular/fire/database';
import { Observable, from, map } from 'rxjs';
import { EmpleadosModel } from '../models/empleados-model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private db = inject(Database);

  // Obtener todos los empleados
  getEmpleados(): Observable<EmpleadosModel[]> {
    const empleadosRef = ref(this.db, 'empleados');
    return listVal<EmpleadosModel>(empleadosRef);
  }

  // Obtener un empleado por ID (Filtramos en el cliente para simplificar)
  getEmpleado(id: string | number): Observable<EmpleadosModel> {
    return this.getEmpleados().pipe(
      map(empleados => empleados.find(e => e.id == id) as EmpleadosModel)
    );
  }

  // Actualizar empleado (Convertimos la Promesa de Firebase a Observable para no romper tu código existente)
  updateEmpleado(empleado: EmpleadosModel): Observable<void> {
    // Asumimos que el ID corresponde al índice en el array de Firebase (id 1 -> índice 0)
    // Si tu JSON tiene ids desordenados, habría que buscar la "key" primero. 
    // Para este caso simple:
    const path = `empleados/${Number(empleado.id) - 1}`; 
    const empleadoRef = ref(this.db, path);
    
    // 'from' convierte la promesa de update en un Observable
    return from(update(empleadoRef, empleado));
  }

  // Buscar por documento
  buscarPorDocumento(documento: string): Observable<EmpleadosModel[]> {
    const empleadosRef = ref(this.db, 'empleados');
    // Creamos una query para filtrar por el campo 'documento'
    const q = query(empleadosRef, orderByChild('documento'), equalTo(documento));
    return listVal<EmpleadosModel>(q);
  }

  // Validar entrada (DNI + Token)
  validarEmpleado(documento: string, token: string): Observable<EmpleadosModel[]> {
    const empleadosRef = ref(this.db, 'empleados');
    const q = query(empleadosRef, orderByChild('documento'), equalTo(documento));
    
    // Firebase filtra por un solo campo, así que filtramos el token en memoria
    return listVal<EmpleadosModel>(q).pipe(
      map(empleados => empleados.filter(e => e.token === token))
    );
  }

  // Buscar por Token (para el link mágico de invitados)
  buscarPorToken(token: string): Observable<EmpleadosModel[]> {
    const empleadosRef = ref(this.db, 'empleados');
    const q = query(empleadosRef, orderByChild('token'), equalTo(token));
    return listVal<EmpleadosModel>(q);
  }
}