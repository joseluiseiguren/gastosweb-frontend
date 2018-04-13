import { Component, OnInit, Inject } from '@angular/core';
import { IAppConfig } from '../app.config/app-config.interface';
import { APP_CONFIG } from '../app.config/app-config.constants';
import { DiarioService } from '../services/diario.service';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { SumaryAnio } from '../models/sumaryanio';

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css']
})
export class AnualComponent implements OnInit {
  anioActual: number = new Date().getFullYear();
  anios: number[] = new Array<number>();
  errorMessage: string = "";
  bsValue: Date;
  sumAnio: SumaryAnio = new SumaryAnio();
  conceptosTotales: any[];
  loading: Boolean = false;

  constructor(@Inject( APP_CONFIG ) private _appConfig: IAppConfig,
              private _diarioService: DiarioService,
              private _userService: UsersService,
              private _helperService: HelperService) {
    this.getPrimerConsumo();
    this.bsValue = new Date(this.anioActual, 0, 1);
  }

  ngOnInit() {
  }

  changeAnio(value: number) {
    let x = new Date(value, this.bsValue.getMonth(), 1);
    this.bsValue = x;
    this.anioActual = value;
    this.getData();
  }

  getPrimerConsumo() {
    this.errorMessage = "";
    this.loading = true;
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
    this._diarioService.getConceptosTotalAnio(this.bsValue.getFullYear())
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
      this._diarioService.getConceptosMovimAnio(ct.idConcepto, this.bsValue.getFullYear())
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
