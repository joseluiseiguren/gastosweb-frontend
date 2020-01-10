import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IConceptoDiario } from '../models/concepto.diario';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormatingService } from '../sharedServices/formatingService';

@Component({
  selector: 'app-diario-enter',
  templateUrl: './diario-enter.component.html',
  styleUrls: ['./diario-enter.component.css']
})
export class DiarioEnterComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private formating: FormatingService,
              public dialogRef: MatDialogRef<DiarioEnterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {concepto: IConceptoDiario}) { }

  ngOnInit() {
    this.form = this.fb.group({
      importeFormControl: [this.formating.FormatNumber(this.data.concepto.importe), [Validators.required]],
      debitoCreditoControl: this.data.concepto.credito.toString() === 'true' ? '1' : '0'      
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log(this.form.value.importeFormControl);
    console.log(this.form.value.debitoCreditoControl);
    
    
    this.dialogRef.close();
  }

  
}
