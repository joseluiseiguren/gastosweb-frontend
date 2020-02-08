import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { IConcepto } from '../models/concepto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConceptoService } from '../services/concepto.service';
import { HelperService } from '../services/helper.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-concepto-dialog',
  templateUrl: './concepto-dialog.component.html',
  styleUrls: ['./concepto-dialog.component.css']
})
export class ConceptoDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading: boolean = false;
  private newConceptoSubscription: Subscription;
  private modifyConceptoSubscription: Subscription;

  constructor(private fb: FormBuilder,
              public snackBar: MatSnackBar,
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
    this.unsubscribeNewConcepto();
    this.unsubscribeModifyConcepto();
  }

  unsubscribeNewConcepto(): void {
    if (this.newConceptoSubscription){ this.newConceptoSubscription.unsubscribe(); }    
  }

  unsubscribeModifyConcepto(): void {
    if (this.modifyConceptoSubscription){ this.modifyConceptoSubscription.unsubscribe(); }    
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }

  private uppercaseFirstLetter (data: string) : string
  {
      return data.charAt(0).toUpperCase() + data.slice(1);
  }

  onSave(): void {
    this.loading = true;
    this.form.value.conceptoFormControl = this.uppercaseFirstLetter(this.form.value.conceptoFormControl);

    //Alta
    if (this.data.concepto === undefined){
      this.newConcepto();
    } else {
      //Modificacion
      this.modifyConcepto();
    }    
  }

  private newConcepto(): void {
    this.unsubscribeNewConcepto();
    this.newConceptoSubscription = this._conceptoService.insertConcepto(this.form.value.conceptoFormControl.toString(), this.form.value.debitoCreditoControl)
        .subscribe(
          () => {
            this.snackBar.open('Alta Exitosa', '', { duration: 2000, direction: 'ltr', verticalPosition: 'bottom' });                
            this.dialogRef.close(true); 
          },
          error => {
            this.loading = false;
            this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });                
        });
  }

  private modifyConcepto(): void {
    this.unsubscribeModifyConcepto();
    this.modifyConceptoSubscription = this._conceptoService.updateConcepto(this.data.concepto._id, this.form.value.conceptoFormControl.toString(), this.form.value.debitoCreditoControl)
        .subscribe(
          () => {
            this.loading = false;
            this.snackBar.open('Modificación Exitosa', '', { duration: 2000, direction: 'ltr', verticalPosition: 'bottom' });                
            this.dialogRef.close(true); 
          },
          error => {
            this.loading = false;
            this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });                
        });
  }
}
