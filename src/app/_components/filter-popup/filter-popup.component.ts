import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatChipInputEvent, MatAutocompleteSelectedEvent, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  frm: FormGroup;
  private _subscriptions = new Subscription();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('conceptosInput', { static: false }) conceptosInput: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,
              private _conceptoService: ConceptoService,
              private _helperService: HelperService,
              public snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<FilterPopupComponent>,
              @Inject(MAT_DIALOG_DATA) allFilters: IMensualFilter) {
    this.allConceptosFiltered = allFilters;
  }

  ngOnInit() {
    this.frm = this.fb.group({
      conceptosFormControl: ['', [Validators.required]]
    });

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

  addConceptoFiltered(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.existConceptoFilter(value) || !this.existConcepto(value)) {
      return;
    }

    if ((value || '').trim()) {
      const concepto = this._allConceptos.filter(x => x.descripcion.toLowerCase() === value.toLowerCase())[0];
      this.allConceptosFiltered.conceptos.push(concepto);
    }

    if (input) {
      input.value = '';
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    if (this.existConceptoFilter(event.option.viewValue.toLowerCase())) {
      return;
    }

    const concepto = this._allConceptos.filter(x => x.descripcion.toLowerCase().trim() === event.option.viewValue.toLowerCase().trim())[0];

    this.allConceptosFiltered.conceptos.push(concepto);
    this.conceptosInput.nativeElement.value = '';
  }

  private existConceptoFilter(concepto: string): boolean {
     return this.allConceptosFiltered.conceptos.filter(x => x.descripcion.toLowerCase() === concepto.toLowerCase()).length > 0;
  }

  private existConcepto(concepto: string): boolean {
    return this._allConceptos.filter(x => x.descripcion.toLowerCase() === concepto.toLowerCase()).length > 0;
 }

}
