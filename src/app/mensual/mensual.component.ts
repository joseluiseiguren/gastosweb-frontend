import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { DatePipe } from '@angular/common';
import { DiarioService } from '../services/diario.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatDialog, MatDatepicker } from '@angular/material';
import { ISaldoItem } from '../models/saldoItem';
import { SumaryAnioService } from '../services/sumary-anio.service';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';

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
export class MensualComponent implements OnInit, OnDestroy {
  loading: Boolean = false;
  conceptosTotales: any[];
  private getDataSubscription: Subscription;
  private summaryDialogSubscription: Subscription;
  currentDate = new FormControl();

  constructor(private _datePipe: DatePipe,
              private _userService: UsersService,
              private _diarioService: DiarioService,
              public snackBar: MatSnackBar,
              private _sumaryAnioService: SumaryAnioService,
              public saldoAbierto: MatDialog,
              private _helperService: HelperService) {  }

  ngOnInit() {
    this.currentDate.setValue(new Date());
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetData();
    this.unsubscribeSummaryDialog();
  }

  unsubscribeSummaryDialog(): void {
    if (this.summaryDialogSubscription){ this.summaryDialogSubscription.unsubscribe(); }    
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  getData() {
    this.loading = true;
    let fecha = this.currentDate.value.getFullYear() + (this.currentDate.value.getMonth() + 1).toString().padStart(2, '0');

    this.unsubscribeGetData();    
    this.getDataSubscription = this._diarioService.getConceptosTotalMes(fecha)
        .subscribe(
            data => { 
              this.conceptosTotales = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getIngresos() : number {
    var ingresos: number = 0;

    if (this.conceptosTotales.filter(x => x.saldo > 0).length > 0) {
      ingresos = this.conceptosTotales.filter(x => x.saldo > 0)
                              .map(c => c.saldo)
                              .reduce((sum, current) => sum + current);
    }
    
    return Math.abs(ingresos);
  }

  getEgresos() : number {
    var egresos: number = 0;

    if (this.conceptosTotales.filter(x => x.saldo < 0).length > 0) {
      egresos = this.conceptosTotales.filter(x => x.saldo < 0)
                              .map(c => c.saldo)
                              .reduce((sum, current) => sum + current);
    }

    return Math.abs(egresos);
  }

  private showOpenSaldo(){
    let saldos: ISaldoItem[] = [];
    
    saldos.push(new ISaldoItem("" + this._helperService.toCamelCase(this._datePipe.transform(this.currentDate.value, 'LLLL yyyy')), "calendar_today", this.getIngresos(), this.getEgresos()));
    
    this.unsubscribeSummaryDialog();    
    this.summaryDialogSubscription = this._sumaryAnioService.getSumary(this.currentDate.value).subscribe((anual) => {
      saldos.push(new ISaldoItem("Año " + this._datePipe.transform(this.currentDate.value, 'yyyy'), "airplay", anual.ingresos, anual.egresos));
      this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });    
    },
    error => {
      this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
    });          
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    this.currentDate.setValue(new Date(normalizedMonth.toString()));
    datepicker.close();
    this.getData();
  }
}


/*
import { Component, OnInit, Inject } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { SumaryMonth } from '../models/sumarymonth';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { SumaryAnio } from '../models/sumaryanio';

@Component({
  selector: 'app-mensual',
  templateUrl: './mensual.component.html',
  styleUrls: ['./mensual.component.css']
})
export class MensualComponent implements OnInit {
  mesActual: Meses;
  meses: Meses[];
  anioActual: number = new Date().getFullYear();
  anios: number[] = new Array<number>();
  errorMessage: string = "";
  bsValue: Date;
  sumMonth: SumaryMonth = new SumaryMonth();
  sumAnio: SumaryAnio = new SumaryAnio();
  conceptosTotales: any[];
  loading: Boolean = false;

  constructor(private _diarioService: DiarioService,
              private _userService: UsersService,
              private _helperService: HelperService) { 
    this.meses = new Array<Meses>();
    for (let _i = 0; _i < 12; _i++) {
      this.meses.push(new Meses(this.getMonthName(_i), _i+1));
    }
    
    this.mesActual = this.meses[new Date().getMonth()];
    this.getPrimerConsumo();
    this.bsValue = new Date(this.anioActual, this.mesActual.numero-1, 1);
  }

  ngOnInit() {
  }

  changeMes(value: number) {
    let x = new Date(this.bsValue.getFullYear(), value-1, 1);
    this.bsValue = x;
    this.mesActual = this.meses[value-1];
    this.getData();
  }

  changeAnio(value: number) {
    let x = new Date(value, this.bsValue.getMonth(), 1);
    this.bsValue = x;
    this.anioActual = value;
    this.getData();
  }

  private getMonthName(value: number) : string {
    let x = new Date();
    x.setMonth(value);
    let mes = x.toLocaleString(this._appConfig.LOCALE, { month: "long" });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    return mes;
  }

  getPrimerConsumo() {
    this.errorMessage = "";
    this._diarioService.getPrimerConsumo()
        .subscribe(
            data => {
              let anioPrimerConsumo = Number(data.fechaMin.substring(0,4));
              let anioUltimoConsumo = Number(data.fechaMax.substring(0,4));

              for (let _i = anioUltimoConsumo; _i >= anioPrimerConsumo; _i--) {
                this.anios.push(_i);
              }
              this.getData();
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
  }

  getData() {
    this.loading = true;
    let fecha = this.bsValue.getFullYear().toString() + (this.bsValue.getMonth()+1).toString().padStart(2, '0');
    this._diarioService.getConceptosTotalMes(fecha)
        .subscribe(
            data => { 
              this.conceptosTotales = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
  }

  loadDetail(event: boolean, ct: any) {
    if (event == true) {
      let fecha = this.bsValue.getFullYear().toString() + (this.bsValue.getMonth()+1).toString().padStart(2, '0');
      this._diarioService.getConceptosMovimMes(ct.idConcepto, fecha)
        .subscribe(
            data => {
              ct.dataAdic = new Array<any>();
              ct.dataAdic = data;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
    }
  }

  childLoadingStatus(errorMessage: string):void{
    this.errorMessage = errorMessage;
  }

}

class Meses {
  nombre: string;
  numero: number;

  constructor(nombre: string, numero: number) { 
    this.nombre = nombre;
    this.numero = numero;
  }
}
*/