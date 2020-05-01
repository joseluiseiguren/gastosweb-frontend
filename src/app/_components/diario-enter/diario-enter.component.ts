import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatChipInputEvent } from '@angular/material';
import { IConceptoDiario } from '../../models/concepto.diario';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormatingService } from '../../sharedServices/formatingService';
import { DiarioService } from '../../services/diario.service';
import { HelperService } from '../../services/helper.service';
import { Subscription } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-diario-enter',
  templateUrl: './diario-enter.component.html',
  styleUrls: ['./diario-enter.component.css']
})
export class DiarioEnterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  private _subscriptions = new Subscription();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];

  constructor(private fb: FormBuilder,
              private formating: FormatingService,
              private _conceptosDiarioService: DiarioService,
              public snackBar: MatSnackBar,
              private _helperService: HelperService,
              public dialogRef: MatDialogRef<DiarioEnterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {concepto: IConceptoDiario}) { }

  ngOnInit() {
    this.form = this.fb.group({
      importeFormControl: [this.formating.FormatNumber(this.data.concepto.importe, true, false), [Validators.required]],
      debitoCreditoControl: this.isCredito().toString() === 'true' ? '1' : '0'
    });
    this.tags = this.data.concepto.tags;
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;

    const newImporte = parseFloat(this.form.value.importeFormControl.toString().replace(',', '.'));
    this._subscriptions.add(this._conceptosDiarioService.setConceptoImporte(
        new Date(this.data.concepto.fecha),
        (this.form.value.debitoCreditoControl === '1') ? newImporte : newImporte * -1,
        this.data.concepto.idconcepto,
        this.tags)
            .subscribe(
              () => {
                this.data.concepto.importe = (this.form.value.debitoCreditoControl === '1' || this.form.value.importeFormControl === 0)
                                              ? newImporte
                                              : newImporte * -1;
                this.data.concepto.credito = this.form.value.debitoCreditoControl;
                this.dialogRef.close(this.data.concepto);
              },
              error => {
                this.loading = false;
                this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
              }
            )
    );
  }

  private isCredito(): boolean {
    if (this.data.concepto.importe === 0) {
      return this.data.concepto.credito === 1 ? true : false;
    } else {
      if (this.data.concepto.importe > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.tags.filter(x => x.toLowerCase() === value.toLowerCase()).length <= 0) {
      if ((value || '').trim()) {
        this.tags.push(value);
      }
    }

    if (input) {
      input.value = '';
    }
  }
}
