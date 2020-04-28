import { formatNumber } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';

export class FormatingService {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  public FormatNumber(data: number, alwaysPositive: boolean, thousandsSeparator: boolean = true): string {
    let numberFormatted =  formatNumber(data, this.locale, '1.2-2');
    if (alwaysPositive) {
      numberFormatted = numberFormatted.replace('-', '');
    }
    if (!thousandsSeparator){
      while(numberFormatted.indexOf(this.thusandsSeparator()) !== -1) {
        numberFormatted = numberFormatted.replace(this.thusandsSeparator() === '.' ? '.' : ',', '');
      }
    }

    return numberFormatted;
  }

  private thusandsSeparator(): string {
    const n = 1.1;
    const x = n.toLocaleString(this.locale).substring(1, 2);
    if (x === ',') {
      return '.';
    }
    return ',';
  }
}
