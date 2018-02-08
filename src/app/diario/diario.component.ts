import { Component, OnInit, TemplateRef } from '@angular/core';
import { DiarioService } from '../services/diario.service';
import { IConceptoDiario } from '../models/concepto.diario';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  bsValue: Date = new Date();
  conceptos: IConceptoDiario[];
  conceptoSel: IConceptoDiario;
  nuevoImporte: number;
  errorMessage: string;
  modalRef: BsModalRef;
  constructor(private _conceptosDiarioService: DiarioService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._conceptosDiarioService.getConceptosImportes(this.bsValue).subscribe(
      data => this.conceptos = data,
      error => this.errorMessage = <any>error);
  }

  openModal(template: TemplateRef<any>, concepto: IConceptoDiario) {
    this.conceptoSel = concepto;
    this.nuevoImporte = this.conceptoSel.importe;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm', ignoreBackdropClick: false, animated: true, keyboard: true}  );
  }
 
  confirm(): void {
    this.conceptoSel.importe = this.nuevoImporte;
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }

}
