import { formatNumber } from '@angular/common';

export class FormatingService {

    public FormatNumber(data: number): string {
        return formatNumber(data, window.navigator.language, '1.2-2');
      }
}