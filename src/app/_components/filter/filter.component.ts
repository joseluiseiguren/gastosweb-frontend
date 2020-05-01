import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  totalFilters = 0;
  private _subscriptions = new Subscription();

  constructor(private filterPopup: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  openFilterPopup() {
    const dialogRef = this.filterPopup.open(FilterPopupComponent, { data: {}, width: '300px', });

    this._subscriptions.add(dialogRef.afterClosed()
      .subscribe(result => {
        this.totalFilters++;
      })
    );
  }

}
