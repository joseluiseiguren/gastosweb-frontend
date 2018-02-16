import { Component, OnInit, Inject } from '@angular/core';
import { IAppConfig } from '../app.config/app-config.interface';
import { APP_CONFIG } from '../app.config/app-config.constants';

@Component({
  selector: 'app-mensual',
  templateUrl: './mensual.component.html',
  styleUrls: ['./mensual.component.css']
})
export class MensualComponent implements OnInit {
  mesActual: Meses;
  meses: Meses[];

  constructor(@Inject( APP_CONFIG ) private _appConfig: IAppConfig) { 
    this.meses = new Array<Meses>();
    for (let _i = 0; _i < 12; _i++) {
      this.meses.push(new Meses(this.getMonthName(_i), _i+1));
    }
    
    this.mesActual = this.meses[new Date().getMonth()];
  }

  ngOnInit() {
  }

  changeMes(value: Meses) {
    this.mesActual = value;
  }

  private getMonthName(value: number) : string {
    let x = new Date();
    x.setMonth(value);
    let mes = x.toLocaleString(this._appConfig.LOCALE, { month: "long" });
    mes = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    return mes;
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
