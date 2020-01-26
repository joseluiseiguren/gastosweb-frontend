import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SumaryAnioService } from '../services/sumary-anio.service';
import { SumaryAnio } from '../models/sumaryanio';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sumaryanio',
  templateUrl: './sumaryanio.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumaryanioComponent implements OnInit, OnDestroy {
  @Input() fecha: Date;
  @Input() sumaryAnio: SumaryAnio;
  @Input() displayTitle: Boolean = true;
  @Output() LoadingStatus = new EventEmitter();
  private sumaryAnioTemp: SumaryAnio;
  loading: Boolean;
  private summarySubscription: Subscription;

  constructor(private _sumaryAnioService: SumaryAnioService,
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
        (changes.fecha.currentValue.getFullYear() != changes.fecha.previousValue.getFullYear())){
      this.getData();
    }
  }

  getData() {
    this.loading = true;
    
    this.unsubscribeGetSummary();
    this.summarySubscription = this._sumaryAnioService.getSumary(this.fecha).subscribe(
      data => this.sumaryAnioTemp = data,
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
    this.sumaryAnio.egresos = this.sumaryAnioTemp.egresos;
    this.sumaryAnio.ingresos = this.sumaryAnioTemp.ingresos;
  }

  sendStatusToParent(errorMessage:string) {
    // le informa al padre que hubo un error en el child
    this.LoadingStatus.emit(errorMessage);
  }

}
