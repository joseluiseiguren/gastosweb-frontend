import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { DatePipe } from '@angular/common';
import { DiarioService } from '../services/diario.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mensual',
  templateUrl: './mensual.component.html',
  styleUrls: ['./mensual.component.css']
})
export class MensualComponent implements OnInit, OnDestroy {
  meses: Meses[];
  anios: number[] = new Array<number>();
  loading: Boolean = false;
  conceptosTotales: any[];
  private getAniosSubscription: Subscription;
  private getDataSubscription: Subscription;
  selectedMonth: number;
  selectedYear: number;

  constructor(private _datePipe: DatePipe,
              private _userService: UsersService,
              private _diarioService: DiarioService,
              public snackBar: MatSnackBar,
              private _helperService: HelperService) { 
    this.meses = new Array<Meses>();
    for (let _i = 0; _i < 12; _i++) {
      this.meses.push(new Meses(this._helperService.toCamelCase(this._datePipe.transform(new Date(new Date(2000, _i, 1)), 'MMMM')), _i+1));
    }
  }

  ngOnInit() {
    this.fillAniosDropDown();
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetAnios();
    this.unsubscribeGetData();
  }

  unsubscribeGetAnios(): void {
    if (this.getAniosSubscription){ this.getAniosSubscription.unsubscribe(); }    
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  fillAniosDropDown() {
    this.loading = false; 

    this.unsubscribeGetAnios();
    this.getAniosSubscription = this._diarioService.getPrimerConsumo()
        .subscribe(
            data => {
              let anioPrimerConsumo = Number(data.fechaMin.substring(0,4));
              let anioUltimoConsumo = Number(data.fechaMax.substring(0,4));

              for (let _i = anioUltimoConsumo; _i >= anioPrimerConsumo; _i--) {
                this.anios.push(_i);
              }
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getData() {
    this.loading = true;
    let fecha = this.selectedYear.toString() + this.selectedMonth.toString().padStart(2, '0');

    this.unsubscribeGetData();    
    this.getAniosSubscription = this._diarioService.getConceptosTotalMes(fecha)
        .subscribe(
            data => { 
              this.conceptosTotales = data;
              this.loading = false;
              console.log(this.conceptosTotales);
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getIngresos() {
    var ingresos: number = 0;

    if (this.conceptosTotales.filter(x => x.saldo > 0).length > 0) {
      ingresos = this.conceptosTotales.filter(x => x.saldo > 0)
                              .map(c => c.saldo)
                              .reduce((sum, current) => sum + current);
    }
    
    return Math.abs(ingresos);                              
  }

  getEgresos() {
    var egresos: number = 0;

    if (this.conceptosTotales.filter(x => x.saldo < 0).length > 0) {
      egresos = this.conceptosTotales.filter(x => x.saldo < 0)
                              .map(c => c.saldo)
                              .reduce((sum, current) => sum + current);
    }

    return Math.abs(egresos);
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