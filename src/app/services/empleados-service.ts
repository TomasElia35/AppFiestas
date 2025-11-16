import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadosModel } from '../models/empleados-model';
// import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {

  private http = inject(HttpClient);
  private urlApi = `http://localhost:3000/empleados`;
  // private urlApi = `http://192.168.160.145:3001/empleados`;
  //private urlApi = environment.apiUrl + '/empleados';

  getEmpleados(){
        return this.http.get<EmpleadosModel[]>(this.urlApi);
  }
  getEmpleado(id: string | number){
    return this.http.get<EmpleadosModel>(`${this.urlApi}/${id}`);
  }
  updateEmpleado(empleado: EmpleadosModel){
    return this.http.put<EmpleadosModel>(`${this.urlApi}/${empleado.id}`, empleado);
  }

  /**
   * Valida un empleado usando su DNI y Token.
   * Devuelve un array, idealmente con 1 resultado si la combinación es correcta.
   */
  validarEmpleado(documento: string, token: string): Observable<EmpleadosModel[]> {
    return this.http.get<EmpleadosModel[]>(`${this.urlApi}?documento=${documento}&token=${token}`);
  }

  // 👇 AÑADIR ESTE MÉTODO (PARA BÚSQUEDA MANUAL)
  /**
   * Busca un empleado usando solo su DNI.
   * Devuelve un array, idealmente con 1 resultado.
   */
  buscarPorDocumento(documento: string): Observable<EmpleadosModel[]> {
    return this.http.get<EmpleadosModel[]>(`${this.urlApi}?documento=${documento}`);
  }
  
}
