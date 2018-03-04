import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SumaryHistorico } from '../models/sumaryHistorico';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { SumaryHistoricoService } from '../services/sumary-historico.service';

@Component({
  selector: 'app-sumaryhistorico',
  templateUrl: './sumaryhistorico.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumaryhistoricoComponent implements OnInit {
  @Output() LoadingStatus = new EventEmitter();
  public sumaryHistorico: SumaryHistorico;
  loading: Boolean = false;
  
  constructor(private _sumaryHistoricoService: SumaryHistoricoService,
              private _userService: UsersService,
              private _helperService: HelperService) { 
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.loading = true;
    this._sumaryHistoricoService.getSumary().subscribe(
      data => this.sumaryHistorico = data,
      error => {
        this.loading = false;

        // le informa al padre que no se pudo cargar debido a un error
        this.sendStatusToParent(this._helperService.getErrorMessage(error));
      },
      () => {
        this.loading = false;
      });
  }

  sendStatusToParent(errorMessage:string) {
    // le informa al padre que hubo un error en el child
    this.LoadingStatus.emit(errorMessage);
  }


}
