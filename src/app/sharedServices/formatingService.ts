import { formatNumber } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';

export class FormatingService {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  public FormatNumber(data: number, alwaysPositive: boolean): string {
    let numberFormatted =  formatNumber(data, this.locale, '1.2-2');
    if (alwaysPositive){
      numberFormatted = numberFormatted.replace('-', '');
    }
    
    return numberFormatted
  }
}