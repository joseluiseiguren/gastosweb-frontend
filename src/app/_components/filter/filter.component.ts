import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FilterPopupComponent } from '../filter-popup/filter-popup.component';
import { Subscription } from 'rxjs';
import { IMensualFilter } from 'src/app/models/mensual.filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  totalFilters = 0;
  @Output() filtersChanged = new EventEmitter<IMensualFilter>();
  filters: IMensualFilter = {conceptos: [], tags: []};
  private _subscriptions = new Subscription();

  constructor(private filterPopup: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  openFilterPopup() {
    const dialogConfig = new MatDialogConfig<IMensualFilter>();
    const data: IMensualFilter = {conceptos: Object.assign([], this.filters.conceptos), tags: Object.assign([], this.filters.tags)};
    dialogConfig.data = data;
    dialogConfig.width = '500px';
    const dialogRef = this.filterPopup.open(FilterPopupComponent, dialogConfig);

    this._subscriptions.add(dialogRef.afterClosed()
      .subscribe((result: IMensualFilter) => {
        if (result === undefined) {
          return;
        }

        this.totalFilters = 0;
        this.filters.conceptos = Object.assign([], result.conceptos);
        this.filters.tags = Object.assign([], result.tags);

        if (this.filters.conceptos.length > 0) {
          this.totalFilters += this.filters.conceptos.length;
        }
        if (this.filters.tags.length > 0) {
          this.totalFilters += this.filters.tags.length;
        }

        this.filtersChanged.emit(this.filters);
      })
    );
  }

}
