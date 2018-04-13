import { Component, OnInit, TemplateRef, ElementRef, ViewRef, ComponentRef, ViewContainerRef, ViewChild, ContentChild, SimpleChanges, Inject, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { IConceptoDiario } from '../models/concepto.diario';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SumaryMonth } from '../models/sumarymonth';
import { UsersService } from '../services/users.service';
import { LocalizacionService } from '../services/localizacion.service';
import { APP_CONFIG } from '../app.config/app-config.constants';
import { IAppConfig } from '../app.config/app-config.interface';
import { HelperService } from '../services/helper.service';
import { SumaryAnio } from '../models/sumaryanio';
import { CurrencyPipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  bsValue: Date = new Date();
  conceptos: IConceptoDiario[];
  conceptoSel: IConceptoDiario;
  nuevoDebCred: number;
  errorMessage: string = "";
  errorMessageModal: string = "";
  modalRef: BsModalRef;
  sumMonth: SumaryMonth = new SumaryMonth();
  sumAnio: SumaryMonth = new SumaryAnio();
  currencyMaskOptions = {
    prefix: this._userService.getMoneda() + ' ',
    thousands: this._appConfig.SEPARADOR_MILES,
    decimal: this._appConfig.SEPARADOR_DECIMALES,
    allowNegative: false,
    precision: 2
  };
  loading: Boolean = false;
  loadingModal: Boolean = false;
  model: string = "";

  constructor(private _conceptosDiarioService: DiarioService,
              private _modalService: BsModalService,
              private _userService: UsersService,
              private _localizacionService: LocalizacionService,
              @Inject( APP_CONFIG ) private _appConfig: IAppConfig,
              private _helperService: HelperService,
              private _currencyPipe:CurrencyPipe) { 
    this.sumMonth.egresos = 0;
    this.sumMonth.ingresos = 0;
    this.sumAnio.egresos = 0;
    this.sumAnio.ingresos = 0;
  }

  ngOnInit() {
    this.getData();

    this._modalService.onShown.subscribe(() => {
      (<HTMLInputElement>document.getElementById('nuevoImporte')).focus();
    });
  }

  changeDay(newValue: Date) {
    if (newValue.getFullYear() != this.bsValue.getFullYear() ||
        newValue.getMonth() != this.bsValue.getMonth() ||
        newValue.getDate() != this.bsValue.getDate()){
        this.bsValue = newValue;
        this.getData();
    }
  }

  getData() {
    this.loading = true;
    this.errorMessage = "";
    this._conceptosDiarioService.getConceptosImportes(this.bsValue)
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

  openModal(template: TemplateRef<any>, concepto: IConceptoDiario) {
    this.loadingModal = false;
    this.errorMessageModal = "";
    this.conceptoSel = concepto;
    if (Math.abs(this.conceptoSel.importe) != 0){
      this.model = Math.abs(this.conceptoSel.importe).toLocaleString(undefined, {minimumFractionDigits: 2});
    } else {
      this.model = "";
    }
    this.nuevoDebCred = (this.conceptoSel.credito) ? 1 : 0;

    this.modalRef = this._modalService.show(template, 
                                      {class: 'modal-sm', 
                                       ignoreBackdropClick: false, 
                                       animated: true, 
                                       keyboard: true,
                                       focus: true}  );
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  changeNuevoDebCred(credito: number): void {
    this.nuevoDebCred = credito;
  }

  childLoadingStatus(errorMessage: string):void{
    this.errorMessage = errorMessage;
  }

  aceptar(form: NgForm){
    this.loadingModal  = true;
    this.errorMessageModal = "";

    // se eliminan las comas
    this.model = this.model.replace(/,/g, '');

    // se valida que el importe sea correcto
    if (isNaN(parseFloat(this.model))){
      console.log("invalid");
      this.loadingModal  = false;
      return;
    }

    this._conceptosDiarioService.setConceptoImporte(
                                    this.bsValue, 
                                    (this.nuevoDebCred == 1) ? parseFloat(this.model) : parseFloat(this.model)*(-1), 
                                    this.conceptoSel.idconcepto)
                .subscribe(
                  data => {
                    this.loadingModal = false;
                    if (this.conceptoSel.credito == 1){
                      this.sumMonth.ingresos -= this.conceptoSel.importe;
                      this.sumAnio.ingresos -= this.conceptoSel.importe;
                    }
                    else{
                      this.sumMonth.egresos -= Math.abs(this.conceptoSel.importe);
                      this.sumAnio.egresos -= Math.abs(this.conceptoSel.importe);
                    }
                    
                    this.conceptoSel.importe = (this.nuevoDebCred == 1) ? parseFloat(this.model) : parseFloat(this.model)*(-1);
                    this.conceptoSel.credito = this.nuevoDebCred;
                
                    if (this.conceptoSel.credito == 1){
                      this.sumMonth.ingresos += this.conceptoSel.importe;
                      this.sumAnio.ingresos += this.conceptoSel.importe;
                    }
                    else{
                      this.sumMonth.egresos += Math.abs(this.conceptoSel.importe);
                      this.sumAnio.egresos += Math.abs(this.conceptoSel.importe);
                    }
                
                    this.modalRef.hide();
                  },
                  error => {
                    this.loadingModal = false; 
                    this.errorMessageModal = this._helperService.getErrorMessage(error);
                    this.modalRef.hide();
                  });
  }
}
