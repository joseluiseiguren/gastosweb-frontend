import { Component, OnInit } from '@angular/core';
import { ConceptoService } from '../services/concepto.service';
import { IConcepto } from '../models/concepto';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {
  conceptos: any[];
  errorMessage: string;
  conceptoActual: IConcepto = new IConcepto();
  pantallaActual: number; /* 0-ninguna / 1 - Alta / 2 - Modificacion */
  pantallaTitulo: string;

  constructor(private _conceptoService: ConceptoService) {
    this.getConceptos();
    this.conceptoActual.id = 0;
    this.conceptoActual.suma = false;
    this.pantallaActual = 0;
  }

  ngOnInit() {
  }

  getConceptos() {
    this._conceptoService.getConceptos()
        .subscribe(
            data => this.conceptos = data,
            error => this.errorMessage = <any>error);
  }

  cambiarPantalla(pantallaNueva: number, conceptoSeleccionado: any) {
    this.pantallaActual = pantallaNueva;
    this.conceptoActual.descripcion = "";
    this.pantallaTitulo = (pantallaNueva == 1) ? "Alta de Concepto" : "Modificacion de Concepto";
    if (conceptoSeleccionado != null) {
      this.conceptoActual.descripcion = conceptoSeleccionado.descripcion;
      this.conceptoActual.suma = conceptoSeleccionado.credito;
    }
    
  }
}
