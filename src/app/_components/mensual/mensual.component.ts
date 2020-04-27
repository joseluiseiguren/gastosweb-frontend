import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, Inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { DatePipe } from '@angular/common';
import { DiarioService } from '../../services/diario.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatDialog, MatDatepicker } from '@angular/material';
import { ISaldoItem } from '../../models/saldoItem';
import { SumaryAnioService } from '../../services/sumary-anio.service';
import { SaldoAbiertoComponent } from '../saldo-abierto/saldo-abierto.component';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { CalculationService } from '../../sharedServices/calculationService';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlConstants } from '../../constants/url.constants';
import { Location } from '@angular/common';

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
  loadingDetail: Boolean = false;
  loadingPopup: Boolean = false;
  conceptosTotales: any[];
  itemDetail: any[];
  private getDataSubscription: Subscription;
  private summaryDialogSubscription: Subscription;
  private itemDetailSubscription: Subscription;
  private saldoItemSubscription: Subscription;
  currentDate = new FormControl();

  constructor(private _datePipe: DatePipe,
              public _userService: UsersService,
              private _diarioService: DiarioService,
              public snackBar: MatSnackBar,
              private _sumaryAnioService: SumaryAnioService,
              public saldoAbierto: MatDialog,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private changeDetector : ChangeDetectorRef,
              private calculationService: CalculationService,
              private _helperService: HelperService) {  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.currentDate = new FormControl(this.getDateFromUrl());
      this.getData();
    });
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetData();
    this.unsubscribeSummaryDialog();
    this.unsubscribeItemDetail();
    this.unsubscribeSaldoItem();
  }

  unsubscribeSummaryDialog(): void {
    if (this.summaryDialogSubscription){ this.summaryDialogSubscription.unsubscribe(); }
  }

  unsubscribeGetData(): void {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }
  }

  unsubscribeItemDetail(): void {
    if (this.itemDetailSubscription){ this.itemDetailSubscription.unsubscribe(); }
  }

  unsubscribeSaldoItem(): void {
    if (this.saldoItemSubscription){ this.saldoItemSubscription.unsubscribe(); }
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

              setTimeout(function (itemToScroll: string) {
                if (itemToScroll === 'none'){
                  return;
                }

                let elmnt = document.getElementById('item' + itemToScroll);
                elmnt.scrollIntoView({block: "start", behavior: "auto"});

                let tt = document.getElementById('mainTable');
                tt.scrollTop = tt.scrollTop - 30;
              }, 1, this.getOpenItem());
            },
            error => {
              this.loading = false;
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getIngresos() : number {
    return this.calculationService.getIngresos(this.convertToNumberArray(this.conceptosTotales));
  }

  getEgresos() : number {
    return this.calculationService.getEgresos(this.convertToNumberArray(this.conceptosTotales));
  }

  private showOpenSaldo(){
    this.loadingPopup = true;
    let saldos: ISaldoItem[] = [];

    saldos.push(new ISaldoItem("" + this._helperService.toCamelCase(this._datePipe.transform(this.currentDate.value, 'LLLL yyyy')),
                "calendar_today",
                this.getIngresos(),
                this.getEgresos(),
                "mensual",
                this.currentDate.value));

    this.unsubscribeSummaryDialog();
    this.summaryDialogSubscription = this._sumaryAnioService.getSumary(this.currentDate.value).subscribe((anual) => {
      saldos.push(new ISaldoItem("Año " + this._datePipe.transform(this.currentDate.value, 'yyyy'),
                  "airplay",
                  anual.ingresos,
                  anual.egresos,
                  "anual",
                  this.currentDate.value));
      let dialogRef = this.saldoAbierto.open(SaldoAbiertoComponent, { width: '500px', data: {saldos} });
      this.loadingPopup = false;

      this.unsubscribeSaldoItem();
      this.saldoItemSubscription = dialogRef.componentInstance.itemPushed.subscribe((item: ISaldoItem) => {
        if (item.concept == UrlConstants.MENSUAL){
          return;
        }
        this.router.navigate([UrlConstants.DASHBOARD + '/' + item.concept + "/" + item.date.getFullYear() + "/none"]);
        dialogRef.close();
      });
    },
    error => {
      this.loadingPopup = false;
      this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
    });
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    this.currentDate.setValue(new Date(normalizedMonth.toString()));
    this.router.navigate([UrlConstants.DASHBOARD + '/' + UrlConstants.MENSUAL + '/' + this.currentDate.value.toISOString() + "/" + this.activeRoute.snapshot.paramMap.get("open")]);
    datepicker.close();
    this.getData();
  }

  loadMonthDetails(row: any) {
    this.loadingDetail = true;
    this.itemDetail = undefined;
    let fecha = this.currentDate.value.getFullYear() + (this.currentDate.value.getMonth() + 1).toString().padStart(2, '0');
    this.unsubscribeItemDetail();
    this.itemDetailSubscription = this._diarioService.getConceptosMovimMes(row.idConcepto, fecha)
        .subscribe(
            data => {
              this.itemDetail = data;
              this.loadingDetail = false;
              this.location.replaceState(UrlConstants.DASHBOARD + '/' + UrlConstants.MENSUAL + '/' + this.currentDate.value.toISOString() + "/" + row.descripcion);
            },
            error => {
              this.loadingDetail = false;
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  getOpenItem() : string {
    return this.activeRoute.snapshot.paramMap.get("open");
  }

  private convertToNumberArray(dataIn: any[]) : number[] {
    let importes: number[] = [];
    dataIn.forEach(function (value) {
      importes.push(value.saldo);
    });

    return importes;
  }

  private getDateFromUrl() :Date {
    let dateUrl = this.activeRoute.snapshot.paramMap.get("month");
    if (dateUrl === 'current') {
      return new Date();
    } else {
      return new Date(dateUrl);
    }
  }

}

