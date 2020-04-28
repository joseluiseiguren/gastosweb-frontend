import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { DatePipe } from '@angular/common';
import { DiarioService } from '../../services/diario.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatDialog, MatDatepicker } from '@angular/material';
import { ISaldoItem } from '../../models/saldoItem';
import { SumaryAnioService } from '../../services/sumary-anio.service';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { CalculationService } from '../../sharedServices/calculationService';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlConstants } from '../../constants/url.constants';
import { Location } from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-mensual',
  templateUrl: './mensual.component.html',
  styleUrls: ['./mensual.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MensualComponent implements OnInit, OnDestroy, AfterViewChecked {
  loading = false;
  loadingDetail = false;
  loadingPopup = false;
  conceptosTotales: any[];
  itemDetail: any[];
  saldoActual = 0;

  private _subscriptions = new Subscription();

  currentDate = new FormControl();

  constructor(private _datePipe: DatePipe,
              public _userService: UsersService,
              private _diarioService: DiarioService,
              public snackBar: MatSnackBar,
              private _sumaryAnioService: SumaryAnioService,
              public saldoAbierto: MatDialog,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private changeDetector: ChangeDetectorRef,
              private calculationService: CalculationService,
              private _helperService: HelperService) {  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.currentDate = new FormControl(this.getDateFromUrl());
      this.getData();
    });
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getData() {
    this.loading = true;
    const fecha = this.currentDate.value.getFullYear() + (this.currentDate.value.getMonth() + 1).toString().padStart(2, '0');

    this._subscriptions.add(this._diarioService.getConceptosTotalMes(fecha)
        .subscribe(
            data => {
              this.conceptosTotales = data;
              this.saldoActual = this.getIngresos() - this.getEgresos();
              this.loading = false;

              setTimeout(function (itemToScroll: string) {
                if (itemToScroll === 'none') {
                  return;
                }

                const elmnt = document.getElementById('item' + itemToScroll);
                elmnt.scrollIntoView({block: 'start', behavior: 'auto'});

                const tt = document.getElementById('mainTable');
                tt.scrollTop = tt.scrollTop - 30;
              }, 1, this.getOpenItem());
            },
            error => {
              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  private getIngresos(): number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  private getEgresos(): number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  showOpenSaldo(): void {
    this.loadingPopup = true;
    const saldos: ISaldoItem[] = [];

    const saldoItemMensual: ISaldoItem = {
      title: '' + this._helperService.toCamelCase(this._datePipe.transform(this.currentDate.value, 'LLLL yyyy')),
      icon: 'calendar_today',
      ingresos: this.getIngresos(),
      egresos: this.getEgresos(),
      concept: 'mensual',
      date: this.currentDate.value
    };
    saldos.push(saldoItemMensual);

    this._subscriptions.add(this._sumaryAnioService.getSumary(this.currentDate.value).subscribe((anual) => {
      const saldoItemAnual: ISaldoItem = {
        title: 'Año ' + this._datePipe.transform(this.currentDate.value, 'yyyy'),
        icon: 'airplay',
        ingresos: anual.ingresos,
        egresos: anual.egresos,
        concept: 'anual',
        date: this.currentDate.value
      };
      saldos.push(saldoItemAnual);

      const dialogRef = this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });
      this.loadingPopup = false;

      this._subscriptions.add(dialogRef.componentInstance.itemPushed
        .subscribe((item: ISaldoItem) => {
          if (item.concept === UrlConstants.MENSUAL) {
            return;
          }
          this.router.navigate([UrlConstants.DASHBOARD + '/' + item.concept + '/' + item.date.getFullYear() + '/none']);
          dialogRef.close();
        })
      );
    },
    error => {
      this.loadingPopup = false;
      this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
    })
    );
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>): void {
    this.currentDate.setValue(new Date(normalizedMonth.toString()));

    const dateIsoString = this.currentDate.value.toISOString();
    const activeRouteOpen = this.activeRoute.snapshot.paramMap.get('open');
    this.router.navigate([UrlConstants.DASHBOARD + '/' + UrlConstants.MENSUAL + '/' + dateIsoString + '/' + activeRouteOpen]);
    datepicker.close();
    this.getData();
  }

  loadMonthDetails(row: any): void {
    this.loadingDetail = true;
    this.itemDetail = undefined;
    const fecha = this.currentDate.value.getFullYear() + (this.currentDate.value.getMonth() + 1).toString().padStart(2, '0');
    this._subscriptions.add(this._diarioService.getConceptosMovimMes(row.idConcepto, fecha)
        .subscribe(
            data => {
              this.itemDetail = data;
              this.loadingDetail = false;
              const dateIsoString = this.currentDate.value.toISOString();
              this.location.replaceState(UrlConstants.DASHBOARD + '/' + UrlConstants.MENSUAL + '/' + dateIsoString + '/' + row.descripcion);
            },
            error => {
              this.loadingDetail = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  getOpenItem(): string {
    return this.activeRoute.snapshot.paramMap.get('open');
  }

  private convertToNumberArray(dataIn: any[]): number[] {
    const importes: number[] = [];
    dataIn.forEach(function (value) {
      importes.push(value.saldo);
    });

    return importes;
  }

  private getDateFromUrl(): Date {
    const dateUrl = this.activeRoute.snapshot.paramMap.get('month');
    if (dateUrl === 'current') {
      return new Date();
    } else {
      return new Date(dateUrl);
    }
  }

}

