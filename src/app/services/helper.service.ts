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
}
