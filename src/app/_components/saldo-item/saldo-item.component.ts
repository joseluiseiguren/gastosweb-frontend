import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISaldoItem } from '../../models/saldoItem';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-saldo-item',
  templateUrl: './saldo-item.component.html',
  styleUrls: ['./saldo-item.component.css']
})
export class SaldoItemComponent implements OnInit {

  @Input() items: ISaldoItem[];
  @Output() itemClicked = new EventEmitter();

  constructor(private _userService: UsersService) { }

  ngOnInit() {
  }

  onGoDetails (item: ISaldoItem) {
    this.itemClicked.emit(item);
  }

}
