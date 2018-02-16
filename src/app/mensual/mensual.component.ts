import { Component, OnInit, Inject } from '@angular/core';
import { IAppConfig } from '../app.config/app-config.interface';
import { APP_CONFIG } from '../app.config/app-config.constants';
import { DiarioService } from '../services/diario.service';
import { SumaryMonth } from '../models/sumarymonth';
import { UsersService } from '../services/users.service';

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
  errorMessage: string;
  bsValue: Date;
  sumMonth: SumaryMonth = new SumaryMonth();
  conceptosTotales: any[];

  constructor(@Inject( APP_CONFIG ) private _appConfig: IAppConfig,
              private _diarioService: DiarioService,
              private _userService: UsersService) { 
    this.meses = new Array<Meses>();
    for (let _i = 0; _i < 12; _i++) {
      this.meses.push(new Meses(this.getMonthName(_i), _i+1));
    }
    
    this.mesActual = this.meses[new Date().getMonth()];
    this.getPrimerConsumo();
    this.bsValue = new Date(this.anioActual, this.mesActual.numero-1, 1);
  }

  ngOnInit() {
    this.getData();
  }

  changeMes(value: number) {
    let x = new Date(this.bsValue.getFullYear(), value-1, 1);
    this.bsValue = x;
  }

  changeAnio(value: number) {
    let x = new Date(value, this.bsValue.getMonth(), 1);
    this.bsValue = x;
  }

  private getMonthName(value: number) : string {
    let x = new Date();
    x.setMonth(value);
    let mes = x.toLocaleString(this._appConfig.LOCALE, { month: "long" });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    return mes;
  }

  getPrimerConsumo() {
    this._diarioService.getPrimerConsumo()
        .subscribe(
            data => {
              let anioPrimerConsumo = Number(data.fechaMin.substring(0,4));
              let anioUltimoConsumo = Number(data.fechaMax.substring(0,4));

              for (let _i = anioUltimoConsumo; _i >= anioPrimerConsumo; _i--) {
                this.anios.push(_i);
              }
            },
            error => this.errorMessage = <any>error);
  }

  getData() {
    let fecha = this.anioActual.toString() + this.mesActual.numero.toString().padStart(2, '0');
    this._diarioService.getConceptosTotalMes(fecha)
        .subscribe(
            data => this.conceptosTotales = data,
            error => this.errorMessage = <any>error);
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
