import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { IConceptoDiario } from '../../models/concepto.diario';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormatingService } from '../../sharedServices/formatingService';
import { DiarioService } from '../../services/diario.service';
import { HelperService } from '../../services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-diario-enter',
  templateUrl: './diario-enter.component.html',
  styleUrls: ['./diario-enter.component.css']
})
export class DiarioEnterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  private saveConceptosubscription: Subscription;

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
  }

  ngOnDestroy(): void {
    this.unsubscribeSaveConcepto();
  }

  unsubscribeSaveConcepto(): void {
    if (this.saveConceptosubscription) { this.saveConceptosubscription.unsubscribe(); }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.unsubscribeSaveConcepto();

    const newImporte = parseFloat(this.form.value.importeFormControl.toString().replace(',', '.'));
    this.saveConceptosubscription = this._conceptosDiarioService.setConceptoImporte(
        new Date(this.data.concepto.fecha),
        (this.form.value.debitoCreditoControl === 1) ? newImporte : newImporte * -1,
        this.data.concepto.idconcepto)
            .subscribe(
              () => {
                this.data.concepto.importe = (this.form.value.debitoCreditoControl === 1 || this.form.value.importeFormControl === 0)
                                              ? newImporte
                                              : newImporte * -1;
                this.data.concepto.credito = this.form.value.debitoCreditoControl;
                this.dialogRef.close(this.data.concepto);
              },
              error =>
              {
                this.loading = false;
                this.snackBar.open(this._helperService.getErrorMessage(error),
                                   '',
                                   { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
              }
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
}
