import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiarioService } from '../../services/diario.service';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { CalculationService } from '../../sharedServices/calculationService';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ISaldoItem } from '../../models/saldoItem';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit, OnDestroy {
  conceptosTotales: any[];
  itemDetail: any[];
  loading = false;
  loadingDetail = false;
  saldoActual = 0;
  private _subscriptions = new Subscription();

  constructor(private _diarioService: DiarioService,
              public _userService: UsersService,
              private calculationService: CalculationService,
              public snackBar: MatSnackBar,
              public saldoAbierto: MatDialog,
              private _helperService: HelperService) {
  }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private getIngresos(): number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  private getEgresos(): number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getData(): void {
    this.loading = true;
    this._subscriptions.add(this._diarioService.getConceptosTotalHistorico()
        .subscribe(
            data => {
              this.conceptosTotales = data;
              this.saldoActual = this.getIngresos() - this.getEgresos();
              this.loading = false;
            },
            error => {
              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  private convertToNumberArray(dataIn: any[]): number[] {
    if (dataIn !== undefined) {
      const importes: number[] = [];
      dataIn.forEach(function (value) {
        importes.push(value.saldo);
      });

      return importes;
    }
  }

  loadHistoricDetails(row: any): void {
    this.loadingDetail = true;
    this.itemDetail = undefined;
    this._subscriptions.add(this._diarioService.getConceptosMovimHistorico(row.idConcepto)
        .subscribe(
            data => {
              this.itemDetail = data;
              this.loadingDetail = false;
            },
            error => {
              this.loadingDetail = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  showOpenSaldo() {
    const saldos: ISaldoItem[] = [];

    const saldoItemHistorico: ISaldoItem = {
      title: 'Historico',
      icon: 'blur_linear',
      ingresos: this.getIngresos(),
      egresos: this.getEgresos(),
      concept: 'historico',
      date: null
    };
    saldos.push(saldoItemHistorico);

    this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });
  }

}
