import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISaldoItem } from '../../models/saldoItem';

@Component({
  selector: 'app-saldo-abierto',
  templateUrl: './saldo-abierto.component.html',
  styleUrls: ['./saldo-abierto.component.css']
})
export class SaldoAbiertoComponent implements OnInit {
  @Output() itemPushed = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<SaldoAbiertoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {saldos: ISaldoItem[]}) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  itemClicked(item: ISaldoItem) {
    this.itemPushed.emit(item);
  }

}
