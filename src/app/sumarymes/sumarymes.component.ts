import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SumaryMonthService } from '../services/sumary-month.service';
import { SumaryMonth } from '../models/sumarymonth';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sumarymes',
  templateUrl: './sumarymes.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumarymesComponent implements OnInit, OnDestroy {
  @Input() fecha: Date;
  @Input() sumaryMonth: SumaryMonth;
  @Input() displayTitle: Boolean = true;
  @Output() LoadingStatus = new EventEmitter();
  private sumaryMonthTemp: SumaryMonth;
  loading: Boolean;
  private summarySubscription: Subscription;

  constructor(private _sumaryMonthService: SumaryMonthService,
              private _userService: UsersService,
              private _helperService: HelperService) { 
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribeGetSummary();
  }

  unsubscribeGetSummary(): void {
    if (this.summarySubscription){ this.summarySubscription.unsubscribe(); }    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fecha.previousValue === undefined ||
        (changes.fecha.currentValue.getFullYear() != changes.fecha.previousValue.getFullYear() ||
         changes.fecha.currentValue.getMonth() != changes.fecha.previousValue.getMonth())){
      this.getData();
    }
  }

  getData() {
    this.loading = true;

    this.unsubscribeGetSummary();
    this.summarySubscription = this._sumaryMonthService.getSumary(this.fecha).subscribe(
      data => this.sumaryMonthTemp = data,
      error => {
        this.loading = false;

        // le informa al padre que no se pudo cargar debido a un error
        this.sendStatusToParent(this._helperService.getErrorMessage(error));
      },
      () => {
        this.copyData();
        this.loading = false;
      });
  }

  copyData() {
    this.sumaryMonth.egresos = this.sumaryMonthTemp.egresos;
    this.sumaryMonth.ingresos = this.sumaryMonthTemp.ingresos;
  }

  sendStatusToParent(errorMessage:string) {
    // le informa al padre que hubo un error en el child
    this.LoadingStatus.emit(errorMessage);
  }

}
