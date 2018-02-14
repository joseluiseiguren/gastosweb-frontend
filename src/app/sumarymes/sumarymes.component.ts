import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SumaryMonthService } from '../services/sumary-month.service';
import { SumaryMonth } from '../models/sumarymonth';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-sumarymes',
  templateUrl: './sumarymes.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumarymesComponent implements OnInit {
  @Input() fecha: Date;
  @Input() sumaryMonth: SumaryMonth;
  private sumaryMonthTemp: SumaryMonth;
  errorMessage: string;

  constructor(private _sumaryMonthService: SumaryMonthService) { 
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fecha.previousValue === undefined ||
        (changes.fecha.currentValue.getFullYear() != changes.fecha.previousValue.getFullYear() ||
         changes.fecha.currentValue.getMonth() != changes.fecha.previousValue.getMonth())){
      this.getData();
    }
  }

  getData() {
    this._sumaryMonthService.getSumary(this.fecha).subscribe(
      data => this.sumaryMonthTemp = data,
      error => this.errorMessage = <any>error,
      () => (this.copyData()));
  }

  copyData() {
    this.sumaryMonth.egresos = this.sumaryMonthTemp.egresos;
    this.sumaryMonth.ingresos = this.sumaryMonthTemp.ingresos;
  }

}
