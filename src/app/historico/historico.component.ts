import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { DiarioService } from '../services/diario.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  errorMessage: string = "";
  conceptosTotales: any[];
  loading: Boolean = false;

  constructor(private _diarioService: DiarioService,
              private _userService: UsersService,
              private _helperService: HelperService) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.loading = true;
    this._diarioService.getConceptosTotalHistorico()
        .subscribe(
            data => { 
              this.conceptosTotales = data;
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
  }

  loadDetail(event: boolean, ct: any) {
    if (event == true) {
      this._diarioService.getConceptosMovimHistorico(ct.idConcepto)
        .subscribe(
            data => {
              ct.dataAdic = new Array<any>();
              ct.dataAdic = data;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
    }
  }

}
