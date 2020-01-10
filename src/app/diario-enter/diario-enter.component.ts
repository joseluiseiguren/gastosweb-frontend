import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IConceptoDiario } from '../models/concepto.diario';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-diario-enter',
  templateUrl: './diario-enter.component.html',
  styleUrls: ['./diario-enter.component.css']
})
export class DiarioEnterComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<DiarioEnterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IConceptoDiario) { 
    console.log(data);
  }

  ngOnInit() {
    this.form = this.fb.group({
      importeFormControl: ['', [Validators.required]],
    });  
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log(this.form.value.importeFormControl);
    
    
    this.dialogRef.close();
  }

 

}
