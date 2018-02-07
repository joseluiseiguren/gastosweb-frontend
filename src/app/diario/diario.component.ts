import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit {
  bsValue: Date = new Date();
  
  
  constructor() { }

  ngOnInit() {
  }

}
