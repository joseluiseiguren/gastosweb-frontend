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
}
