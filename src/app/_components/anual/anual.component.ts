import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { DiarioService } from '../../services/diario.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ISaldoItem } from '../../models/saldoItem';
import { DatePipe } from '@angular/common';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { CalculationService } from '../../sharedServices/calculationService';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlConstants } from '../../constants/url.constants';

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css']
})
export class AnualComponent implements OnInit, OnDestroy, AfterViewChecked {
  anios = new Array<number>();
  anioSelected: number;
  loading = false;
  loadingDetail = false;
  conceptosTotales: any[];
  itemDetail: any[];
  saldoAnual = 0;
  openItem: string;

  private _subscriptions = new Subscription();

  constructor(private _datePipe: DatePipe,
              private _diarioService: DiarioService,
              public _userService: UsersService,
              public snackBar: MatSnackBar,
              public saldoAbierto: MatDialog,
              private calculationService: CalculationService,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private activeRoute: ActivatedRoute,
              private _helperService: HelperService) {
    this.anioSelected = this.getYearFromUrl();
  }

  ngOnInit(): void {
    this.getPrimerConsumo();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getPrimerConsumo(): void {
    this.loading = true;
    this._subscriptions.add(this._diarioService.getPrimerConsumo()
      .subscribe(
        data => {
          const anioPrimerConsumo = Number(data.fechaMin.substring(0, 4));
          const anioUltimoConsumo = Number(data.fechaMax.substring(0, 4));

          for (let _i = anioUltimoConsumo; _i >= anioPrimerConsumo; _i--) {
            this.anios.push(_i);
          }
          this.getData();
          this.loading = false;
        },
        error => {
          this.loading = false;
          this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
        }
      )
    );
  }

  showOpenSaldo(): void {
    const saldos: ISaldoItem[] = [];

    const saldoItem: ISaldoItem = {
      title: 'Año' + this._helperService.toCamelCase(this._datePipe.transform(new Date(this.anioSelected, 1, 1), 'yyyy')),
      icon: 'airplay',
      ingresos: this.getIngresos(),
      egresos: this.getEgresos(),
      concept: 'anual',
      date: new Date(this.anioSelected, 1, 1)
    };

    saldos.push(saldoItem);
    this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });
  }

  loadYearDetails(row: any): void {
    this.loadingDetail = true;

    this.openItem = row.descripcion;
    this.itemDetail = undefined;
    this._subscriptions.add(this._diarioService.getConceptosMovimAnio(row.idConcepto, this.anioSelected)
      .subscribe(
          data => {
            this.itemDetail = data;

            this.itemDetail.forEach((element) => {
              const fecha = this._helperService.convertStringMMYYYYToDate(element.mes);
              element.MonthFormatted = this._helperService.toCamelCase(this._datePipe.transform(fecha, 'LLLL yyyy'));
            });

            this.loadingDetail = false;
            this.router.navigate([UrlConstants.DASHBOARD, UrlConstants.ANUAL, this.anioSelected, this.openItem],
                                  {replaceUrl: false});
          },
          error => {
            this.loadingDetail = false;
            this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
          }
      )
    );
  }

  onChangeYear(): void {
    this.router.navigate([UrlConstants.DASHBOARD, UrlConstants.ANUAL, this.anioSelected, this.openItem],
                         {replaceUrl: false});
    this.getData();
  }

  goToMonth(fecha: string, concepto: string ): void {
    const fechaFormated = this.convertMMYYYYToYYYYMM(fecha);
    this.router.navigate([UrlConstants.DASHBOARD, UrlConstants.MENSUAL, fechaFormated, concepto]);
  }

  getOpenItem(): string {
    return this.activeRoute.snapshot.paramMap.get('open');
  }

  private scrollToItem(item: string): void {
    setTimeout(function (itemToScroll: string) {
      if (itemToScroll === 'none') {
        return;
      }

      const elmnt = document.getElementById('item' + itemToScroll);
      if (elmnt === null) {
        return;
      }
      elmnt.scrollIntoView({block: 'start', behavior: 'auto'});

      const tt = document.getElementById('mainTable');
      tt.scrollTop = tt.scrollTop - 30;
    }, 1, item);
  }

  private convertToNumberArray(dataIn: any[]): number[] {
    if (dataIn !== undefined){
      const importes: number[] = [];
      dataIn.forEach(function (value) {
        importes.push(value.saldo);
      });

      return importes;
    }
  }

  private getYearFromUrl(): number {
    const dateUrl = this.activeRoute.snapshot.paramMap.get('anio');
    return Number(dateUrl);
  }

  private getIngresos(): number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  private getEgresos(): number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  private getData(): void {
    this.loading = true;
    this._subscriptions.add(this._diarioService.getConceptosTotalAnio(this.anioSelected)
        .subscribe(
            data => {
              this.conceptosTotales = data;
              this.loading = false;
              this.saldoAnual = this.getIngresos() - this.getEgresos();

              this.openItem = this.getOpenItem();
              this.scrollToItem(this.openItem);
            },
            error => {
              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            }
          )
    );
  }

  private convertMMYYYYToYYYYMM(fecha: string): string {
    return fecha.substring(2, 8) + '-' + fecha.substring(0, 2);
  }
}
