import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadosModel } from '../models/empleados-model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {

  private http = inject(HttpClient);
  private urlApi = 'http://localhost:3000/empleados';

  getEmpleados(){
        return this.http.get<EmpleadosModel[]>(this.urlApi);
  }
  getEmpleado(id: string | number){
    return this.http.get<EmpleadosModel>(`${this.urlApi}/${id}`);
  }
  updateEmpleado(empleado: EmpleadosModel){
    return this.http.put<EmpleadosModel>(`${this.urlApi}/${empleado.id}`, empleado);
  }

}
