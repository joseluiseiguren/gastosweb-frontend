import { formatNumber } from '@angular/common';

export class FormatingService {

    public FormatNumber(data: number, alwaysPositive: boolean): string {
      let numberFormatted =  formatNumber(data, window.navigator.language, '1.2-2');
      if (alwaysPositive){
        numberFormatted = numberFormatted.replace('-', '');
      }
      
      return numberFormatted
    }
}