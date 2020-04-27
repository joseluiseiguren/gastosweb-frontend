import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css']
})
export class SaldoComponent implements OnInit {
  @Input() titulo: string;
  @Input() saldo: number;
  @Output() saldoClicked = new EventEmitter();

  constructor(public _userService: UsersService) { }

  ngOnInit() {
  }

  onClick() {
    this.saldoClicked.emit();
  }
}
