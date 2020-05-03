import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef,
         MatSnackBar,
         MatChipInputEvent,
         MatAutocompleteSelectedEvent,
         MAT_DIALOG_DATA,
         MatAutocompleteTrigger } from '@angular/material';
import { ConceptoService } from 'src/app/services/concepto.service';
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { IConcepto } from 'src/app/models/concepto';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { IMensualFilter } from 'src/app/models/mensual.filter';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.css']
})
export class FilterPopupComponent implements OnInit {

  loading = false;
  private _allConceptos: IConcepto[] = [];
  public allConceptos: IConcepto[] = [];
  public allConceptosFiltered: IMensualFilter;
  private _subscriptions = new Subscription();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterInput: string;

  @ViewChild('trigger', {static: false}) autocomplete: MatAutocompleteTrigger;
  @ViewChild('cancelButton', {static: false}) cancelButton: ElementRef;

  constructor(private _conceptoService: ConceptoService,
              private _helperService: HelperService,
              public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<FilterPopupComponent>,
              @Inject(MAT_DIALOG_DATA) allFilters: IMensualFilter) {
    this.allConceptosFiltered = allFilters;
  }

  ngOnInit() {
    this.getConceptos();
  }

  getConceptos() {
    this.loading = true;
    this._subscriptions.add(this._conceptoService.getConceptos()
        .subscribe(
            data => {
              this._allConceptos = data;
              this.allConceptos = data;
              this.loading = false;
            },
            error => {
              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  onChangeConcepto(event: string) {
    if (event) {
      this.allConceptos = this._allConceptos.filter(x => x.descripcion.toLowerCase().startsWith(event.toLowerCase()));
    } else {
      this.allConceptos = this._allConceptos.filter(x => 1 === 1);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close( this.allConceptosFiltered );
  }

  removeConceptoFiltered(concepto: IConcepto): void {
    const index = this.allConceptosFiltered.conceptos.map(e => e.descripcion.toLowerCase()).indexOf(concepto.descripcion.toLowerCase());

    if (index >= 0) {
      this.allConceptosFiltered.conceptos.splice(index, 1);
    }
  }

  onAddConceptoFiltered(event: MatChipInputEvent): void {
    this.addConceptoFiltered(this.filterInput);
  }

  private addConceptoFiltered(conceptoToAdd: string): void {
    if ((conceptoToAdd || '').trim()) {
      const concep = this._allConceptos.filter(x => x.descripcion.toLowerCase().startsWith(conceptoToAdd.toLowerCase()));
      if (concep.length > 0) {
        if (!this.existConceptoFilter(concep[0].descripcion)) {
          this.allConceptosFiltered.conceptos.push(concep[0]);
        }
      }
    }

    this.filterInput = '';
    this.autocomplete.closePanel();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addConceptoFiltered(event.option.viewValue.toLowerCase());
  }

  private existConceptoFilter(concepto: string): boolean {
     return this.allConceptosFiltered.conceptos.filter(x => x.descripcion.toLowerCase() === concepto.toLowerCase()).length > 0;
  }

  onDeleteFilters() {
    this.allConceptosFiltered.conceptos = [];
  }
}
