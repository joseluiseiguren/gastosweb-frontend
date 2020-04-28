import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HelperService {

    constructor() { }

    getErrorMessage(error: any): string {
        let message = '';

        if (error === undefined ||
            error.status === undefined) {
                return message;
        }

        switch (error.status) {
            case 0:
              message = 'No se pudo conectar al servidor, intentar nuevamente';
              break;

            case 400: /* bad request */
              message = error.error.message;
              break;

            case 401: /* Unathorized */
              message = 'Session Expirada';
              break;

            case 500: /* internal server error */
              message = 'Error Inesperado: ' + error.error.errorId;
              break;
          }

          return message;
    }

    convertStringMMYYYYToDate(fecha: string /* MMYYYY */): Date {
        const mes = Number(fecha.substring(0, 2)) - 1;
        const anio = Number(fecha.substring(2, 6));

        const retFecha = new Date(anio, mes, 1);

        return retFecha;
    }

    /* La fecha de entrada es 1980-05-13T00:00:00.000Z y la de salida 13/05/1980*/
    convertStringYYYMMDDToStringDDMMYYYY(fecha: string): string {
        const dia = fecha.substring(8, 10);
        const mes = fecha.substring(5, 7);
        const anio = fecha.slice(0, 4);

        return dia + '/' + mes + '/' + anio;
    }

    toCamelCase(strInput: string): string {
      const str = strInput.split(' ');

      for (let i = 0, x = str.length; i < x; i++) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }

      return str.join(' ');
    }

    showSnackBarError(snackBar: MatSnackBar, errorMessage: string): void {
      snackBar.open(errorMessage,
                    '',
                    { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
    }

    showSnackBarInformation(snackBar: MatSnackBar, message: string): void {
      snackBar.open(message, '', { duration: 2000, direction: 'ltr', verticalPosition: 'bottom' });
    }

    showSnackBarSuccess(snackBar: MatSnackBar, message: string): void {
      snackBar.open(message,
                    '',
                    { duration: 2000, panelClass: ['success-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
    }
}
