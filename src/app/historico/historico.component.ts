import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { CalculationService } from '../sharedServices/calculationService';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ISaldoItem } from '../models/saldoItem';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit, OnDestroy {
  errorMessage: string = "";
  conceptosTotales: any[];
  itemDetail: any[];
  loading: Boolean = false;
  loadingDetail: Boolean = false;
  private getDataSubscription: Subscription;
  private getHistoricDetailSubscription: Subscription;

  constructor(private _diarioService: DiarioService,
              private _userService: UsersService,
              private calculationService: CalculationService,
              public snackBar: MatSnackBar,
              public saldoAbierto: MatDialog,
              private _helperService: HelperService) {    
  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetData();
    this.unsubscribeGetHistoricDetail();
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  unsubscribeGetHistoricDetail(): void {
    if (this.getHistoricDetailSubscription){ this.getHistoricDetailSubscription.unsubscribe(); }    
  }

  getIngresos() : number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getEgresos() : number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getData() {
    this.loading = true;
    this.unsubscribeGetData();
    this.getDataSubscription = this._diarioService.getConceptosTotalHistorico()
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

  private convertToNumberArray(dataIn: any[]) : number[] {
    if (dataIn !== undefined){
      let importes: number[] = [];
      dataIn.forEach(function (value) {
        importes.push(value.saldo);
      }); 

      return importes;
    }  
  }
  
  loadHistoricDetails(row: any) {    
    this.loadingDetail = true;
    this.itemDetail = undefined;
    this.unsubscribeGetHistoricDetail();
    this.getHistoricDetailSubscription = this._diarioService.getConceptosMovimHistorico(row.idConcepto)
        .subscribe(
            data => {
              this.itemDetail = data;
              this.loadingDetail = false; 
            },
            error => {
              this.loadingDetail = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  private showOpenSaldo(){
    let saldos: ISaldoItem[] = [];
    
    saldos.push(new ISaldoItem("Historico" + '', "blur_linear", this.getIngresos(), this.getEgresos()));    
    this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });    
  }

}
