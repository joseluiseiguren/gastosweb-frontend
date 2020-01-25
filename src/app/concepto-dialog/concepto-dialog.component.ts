import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IConcepto } from '../models/concepto';

@Component({
  selector: 'app-concepto-dialog',
  templateUrl: './concepto-dialog.component.html',
  styleUrls: ['./concepto-dialog.component.css']
})
export class ConceptoDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConceptoDialogComponent>,              
              @Inject(MAT_DIALOG_DATA) public data: {concepto: IConcepto}) { }

  ngOnInit() {
  }

}
