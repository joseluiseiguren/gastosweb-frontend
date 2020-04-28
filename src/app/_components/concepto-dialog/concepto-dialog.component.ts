import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { IConcepto } from '../../models/concepto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConceptoService } from '../../services/concepto.service';
import { HelperService } from '../../services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-concepto-dialog',
  templateUrl: './concepto-dialog.component.html',
  styleUrls: ['./concepto-dialog.component.css']
})
export class ConceptoDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  private _subscriptions = new Subscription();

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private _conceptoService: ConceptoService,
              private _helperService: HelperService,
              public dialogRef: MatDialogRef<ConceptoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {concepto: IConcepto}) { }

  ngOnInit() {
    this.form = this.fb.group({
      conceptoFormControl: [this.data.concepto ? this.data.concepto.descripcion : '', Validators.required],
      debitoCreditoControl: this.data.concepto !== undefined && this.data.concepto.suma === true ? '1' : '0'
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.form.value.conceptoFormControl = this._helperService.toCamelCase(this.form.value.conceptoFormControl);

    // Alta
    if (this.data.concepto === undefined){
      this.newConcepto();
    } else {
      // Modificacion
      this.modifyConcepto();
    }
  }

  private newConcepto(): void {
    this._subscriptions.add(this._conceptoService.insertConcepto(this.form.value.conceptoFormControl.toString(),
                            this.form.value.debitoCreditoControl)
        .subscribe(
          () => {
            this._helperService.showSnackBarInformation(this.snackBar, 'Alta Exitosa');
            this.dialogRef.close(true);
          },
          error => {
            this.loading = false;
            this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
        })
    );
  }

  private modifyConcepto(): void {
    this._subscriptions.add(this._conceptoService.updateConcepto(this.data.concepto._id, this.form.value.conceptoFormControl.toString(),
                            this.form.value.debitoCreditoControl)
        .subscribe(
          () => {
            this.loading = false;
            this._helperService.showSnackBarInformation(this.snackBar, 'Modificación Exitosa');
            this.dialogRef.close(true);
          },
          error => {
            this.loading = false;
            this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
        })
    );
  }
}
