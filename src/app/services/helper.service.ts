import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {
  
    constructor() { }

    getErrorMessage(error: any): string {

        let message: string = "";

        if (error === undefined ||
            error.status === undefined) {
                return message;
        }
        
        switch (error.status) {
            case 0:
              message = "No se pudo conectar al servidor, intentar nuevamente";
              break;

            case 400: /* bad request */
              message = error.error.message;
              break;

            case 401: /* Unathorized */
              message = "Session Expirada";
              break;
            
            case 500: /* internal server error */
              message = "Error Inesperado: " + error.error.errorId;
              break;
          }
          
          return message;
    } 

    convertStringMMYYYYToDate(fecha: string /* MMYYYY */): Date {
        let mes = Number(fecha.substring(0,2))-1;
        let anio = Number(fecha.substring(2,6));
        
        let retFecha = new Date(anio, mes, 1);
        
        return retFecha;
    }

    /* La fecha de entrada es 1980-05-13T00:00:00.000Z y la de salida 13/05/1980*/
    convertStringYYYMMDDToStringDDMMYYYY(fecha: string): string {
        let dia = fecha.substring(8, 10);
        let mes = fecha.substring(5, 7);
        let anio = fecha.slice(0, 4);
        
        return dia + "/" + mes + "/" + anio;
    }
}
