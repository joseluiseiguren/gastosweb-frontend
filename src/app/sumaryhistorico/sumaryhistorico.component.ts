import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SumaryHistorico } from '../models/sumaryHistorico';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { SumaryHistoricoService } from '../services/sumary-historico.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sumaryhistorico',
  templateUrl: './sumaryhistorico.component.html',
  styleUrls: ['../shared/styles/sumary.css']
})
export class SumaryhistoricoComponent implements OnInit, OnDestroy {
  @Output() LoadingStatus = new EventEmitter();
  public sumaryHistorico: SumaryHistorico;
  loading: Boolean = false;
  private summarySubscription: Subscription;
  
  constructor(private _sumaryHistoricoService: SumaryHistoricoService,
              private _userService: UsersService,
              private _helperService: HelperService) { 
    this.getData();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribeGetSummary();
  }

  unsubscribeGetSummary(): void {
    if (this.summarySubscription){ this.summarySubscription.unsubscribe(); }    
  }

  getData() {
    this.loading = true;

    this.unsubscribeGetSummary();
    this.summarySubscription = this._sumaryHistoricoService.getSumary().subscribe(
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
