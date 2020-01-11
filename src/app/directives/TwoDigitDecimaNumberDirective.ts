import { Directive, ElementRef, HostListener, Inject, LOCALE_ID } from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
  private decimalSeparator: string = this.whatDecimalSeparator();
  private regexEn: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private regexEs: RegExp = new RegExp(/^\d*\,?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Enter', 'Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef, @Inject(LOCALE_ID) private locale: string) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      //console.log("1");
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? this.whatDecimalSeparator() : event.key, current.slice(position)].join('');
    if (this.locale == 'es'){
      if (next && !String(next).match(this.regexEs)) {
        event.preventDefault();
      }
    } else{
      if (next && !String(next).match(this.regexEn)) {
        event.preventDefault();
      }
    }
  }

  private whatDecimalSeparator(): string {
    let n = 1.1;
    let x = n.toLocaleString(this.locale).substring(1, 2);
    return x;
  }
}