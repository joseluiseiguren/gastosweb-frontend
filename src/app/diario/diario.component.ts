import { Component, OnInit } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { IConceptoDiario } from '../models/concepto.diario';
import { SumaryMonth } from '../models/sumarymonth';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { SumaryAnio } from '../models/sumaryanio';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DiarioEnterComponent } from '../diario-enter/diario-enter.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  conceptos: IConceptoDiario[];
  conceptoSel: IConceptoDiario;
  errorMessage: string = "";
  sumMonth: SumaryMonth = new SumaryMonth();
  sumAnio: SumaryMonth = new SumaryAnio();
  loading: Boolean = false;
  displayedColumns: string[] = ['descripcion', 'importe'];
  currentDate = new FormControl(new Date());

  constructor(private _conceptosDiarioService: DiarioService,
              private _userService: UsersService,
              private _helperService: HelperService,
              public enterDiario: MatDialog) { 
    this.sumMonth.egresos = 0;
    this.sumMonth.ingresos = 0;
    this.sumAnio.egresos = 0;
    this.sumAnio.ingresos = 0;
  }

  ngOnInit() {
    this.getData();
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.errorMessage = "";
    this._conceptosDiarioService.getConceptosImportes(this.currentDate.value)
        .subscribe(
            data => { 
              this.conceptos = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
  }

  openConcepto(concepto: IConceptoDiario){    
    this.enterDiario.open(DiarioEnterComponent, { data: {concepto} });    
  }  
}
