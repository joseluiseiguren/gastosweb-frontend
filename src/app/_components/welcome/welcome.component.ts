import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/user';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WelcomeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {user: User}) { }

  ngOnInit() {
  }

}
