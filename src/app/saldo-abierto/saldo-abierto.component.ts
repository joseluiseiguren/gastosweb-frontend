import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-saldo-abierto',
  templateUrl: './saldo-abierto.component.html',
  styleUrls: ['./saldo-abierto.component.css']
})
export class SaldoAbiertoComponent implements OnInit {
  
  constructor(private _userService: UsersService,
              public dialogRef: MatDialogRef<SaldoAbiertoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {ingresos: number, egresos: number}) { }

  ngOnInit() {    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
