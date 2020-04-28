import { Directive, ElementRef, HostListener, Inject, LOCALE_ID } from '@angular/core';

@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  // Allow decimal numbers and negative values
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
      return;
    }

    const keyPressed = event.key;

    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position),
                          keyPressed === 'Decimal' ? this.whatDecimalSeparator() : keyPressed, current.slice(position)]
                          .join('');

    if (this.whatDecimalSeparator() === ',') {
      if (next && !String(next).match(this.regexEs)) {
        if (keyPressed === '.' && this.el.nativeElement.value.indexOf(',') === -1) {
          this.validateFields(event);
        } else {
          event.preventDefault();
          return;
        }
      }
    } else {
      if (next && !String(next).match(this.regexEn)) {
        event.preventDefault();
        return;
      }
    }
  }

  private validateFields(event: any): void {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace('.', ',');
      event.preventDefault();

    }, 10)
  }

  private whatDecimalSeparator(): string {
    const n = 1.1;
    const x = n.toLocaleString(this.locale).substring(1, 2);
    return x;
  }
}
