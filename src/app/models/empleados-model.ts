export interface EmpleadosModel {
    id: string |number;
    nombre: string;
    documento: string;
    Empresa: string;
    Sector: string;
    Asistio: boolean;
    fechaAsistida: Date | null;
    token: string;
}
