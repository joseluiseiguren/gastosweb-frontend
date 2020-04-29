import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiarioService } from '../../services/diario.service';
import { IConceptoDiario } from '../../models/concepto.diario';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { MatDialog, MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { DiarioEnterComponent } from '../diario-enter/diario-enter.component';
import { FormControl } from '@angular/forms';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { ISaldoItem } from '../../models/saldoItem';
import { DatePipe } from '@angular/common';
import { SumaryMonthService } from '../../services/sumary-month.service';
import { SumaryAnioService } from '../../services/sumary-anio.service';
import { forkJoin, Subscription } from 'rxjs';
import { CalculationService } from '../../sharedServices/calculationService';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlConstants } from '../../constants/url.constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit, OnDestroy {
  conceptos: IConceptoDiario[];
  loading: Boolean = false;
  loadingPopup: Boolean = false;
  displayedColumns: string[] = ['descripcion', 'importe'];
  currentDate: FormControl;
  saldoDiario = 0;

  private _subscriptions = new Subscription();

  constructor(private _conceptosDiarioService: DiarioService,
              public _userService: UsersService,
              private _helperService: HelperService,
              private datePipe: DatePipe,
              public snackBar: MatSnackBar,
              private _sumaryMonthService: SumaryMonthService,
              private _sumaryAnioService: SumaryAnioService,
              private calculationService: CalculationService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              public enterDiario: MatDialog,
              public saldoAbierto: MatDialog) {}

  ngOnInit() {
    this._subscriptions.add(this.activeRoute.params
      .subscribe(routeParams => {
        const controlDate = this.getDateFromUrl();
        controlDate.setMonth(controlDate.getMonth() - 1);
        this.currentDate = new FormControl(controlDate);

        this.getData();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>): void {
    const newDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.router.navigate([UrlConstants.DASHBOARD, UrlConstants.DIARIO, newDate]);
  }

  getData(): void {
    this.loading = true;

    this._subscriptions.add(this._conceptosDiarioService.getConceptosImportes(this.currentDate.value)
        .subscribe(
            data => {
              this.conceptos = data;
              this.saldoDiario = this.getIngresos() - this.getEgresos();
              this.loading = false;
            },
            error => {
              this.loading = false;
              this.snackBar.open(this._helperService.getErrorMessage(error),
                                 '',
                                 { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            })
    );
  }

  openConcepto(concepto: IConceptoDiario): void {
    const dialogRef = this.enterDiario.open(DiarioEnterComponent, { data: {concepto} });

    this._subscriptions.add(dialogRef.afterClosed()
      .subscribe(result => {
        this.saldoDiario = this.getIngresos() - this.getEgresos();
      })
    );
  }

  private getIngresos(): number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptos));
  }

  private getEgresos(): number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptos));
  }

  public showOpenSaldo(): void {
    this.loadingPopup = true;
    const saldos: ISaldoItem[] = [];

    const saldoItemDiario: ISaldoItem = {
      title: '' + this._helperService.toCamelCase(this.datePipe.transform(new Date(this.currentDate.value),
             'mediumDate')),
      icon: 'today',
      ingresos: this.getIngresos(),
      egresos: this.getEgresos(),
      concept: 'diario',
      date: new Date(this.currentDate.value)
    };

    saldos.push(saldoItemDiario);

    this._subscriptions.add(forkJoin(this._sumaryMonthService.getSumary(this.currentDate.value),
                                              this._sumaryAnioService.getSumary(this.currentDate.value))
        .subscribe(([mensual, anual]) => {

          const saldoItemMensual: ISaldoItem = {
            title: '' + this._helperService.toCamelCase(this.datePipe.transform(new Date(this.currentDate.value),
                   'LLLL yyyy')),
            icon: 'calendar_today',
            ingresos: mensual.ingresos,
            egresos: mensual.egresos,
            concept: 'mensual',
            date: new Date(this.currentDate.value)
          };
          saldos.push(saldoItemMensual);


          const saldoItemAnual: ISaldoItem = {
            title: 'Año ' + this.datePipe.transform(new Date(this.currentDate.value), 'yyyy'),
            icon: 'airplay',
            ingresos: anual.ingresos,
            egresos: anual.egresos,
            concept: 'mensual',
            date: new Date(this.currentDate.value)
          };
          saldos.push(saldoItemAnual);

          this.loadingPopup = false;
          const dialogRef = this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });

          this._subscriptions.add(dialogRef.componentInstance.itemPushed
            .subscribe((item: ISaldoItem) => {
              if (item.concept === UrlConstants.DIARIO) {
                return;
              }

              dialogRef.close();

              if (item.concept === UrlConstants.ANUAL) {
                this.router.navigate([UrlConstants.DASHBOARD, item.concept, item.date.getFullYear(), 'none']);
              } else {
                this.router.navigate([UrlConstants.DASHBOARD, item.concept, item.date.toISOString(), 'none']);
              }
            })
          );
        },
        error => {
          this.loadingPopup = false;
          this.snackBar.open(this._helperService.getErrorMessage(error),
                             '',
                             { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
        })
    );
  }

  private convertToNumberArray(dataIn: IConceptoDiario[]): number[] {
    const importes: number[] = [];
    dataIn.forEach(function (value) {
      importes.push(value.importe);
    });

    return importes;
  }

  private getDateFromUrl(): Date {
    const dateUrl = this.activeRoute.snapshot.paramMap.get('day').split('-');
    return new Date(Number(dateUrl[0]), Number(dateUrl[1]), Number(dateUrl[2]));
  }



}
