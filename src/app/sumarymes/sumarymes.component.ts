import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SumaryMonthService } from '../services/sumary-month.service';
import { ISumaryMonth } from '../models/sumarymonth';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-sumarymes',
  templateUrl: './sumarymes.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumarymesComponent implements OnInit {
  @Input() fecha: Date;
  sumaryMonth: ISumaryMonth;
  errorMessage: string;

  constructor(private _sumaryMonthService: SumaryMonthService) { 
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
  }

  getData() {
    this._sumaryMonthService.getSumary(this.fecha).subscribe(
      data => this.sumaryMonth = data,
      error => this.errorMessage = <any>error);
  }

}
