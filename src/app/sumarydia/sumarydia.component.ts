import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SumaryDayService } from '../services/sumary-day.service';
import { ISumaryDay } from '../models/sumaryday';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-sumarydia',
  templateUrl: './sumarydia.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumarydiaComponent implements OnInit, OnChanges {
  @Input() fecha: Date;
  sumaryDay: ISumaryDay;
  errorMessage: string;

  constructor(private _sumaryDayService: SumaryDayService) { 
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
  }

  getData() {
    this._sumaryDayService.getSumary(this.fecha).subscribe(
      data => this.sumaryDay = data,
      error => this.errorMessage = <any>error);
  }

}
