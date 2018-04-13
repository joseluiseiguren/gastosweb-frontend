import { Component, OnInit, Inject } from '@angular/core';
import { IAppConfig } from '../app.config/app-config.interface';
import { APP_CONFIG } from '../app.config/app-config.constants';
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

  constructor(@Inject( APP_CONFIG ) private _appConfig: IAppConfig,
              private _diarioService: DiarioService,
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
