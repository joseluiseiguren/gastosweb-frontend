import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConceptoService } from '../../services/concepto.service';
import { IConcepto } from '../../models/concepto';
import { HelperService } from '../../services/helper.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ConceptoDialogComponent } from '../concepto-dialog/concepto-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['concepto', 'tipo'];
  loading = false;
  conceptos: IConcepto[] = [];
  private _subscriptions = new Subscription();

  constructor(private _conceptoService: ConceptoService,
              private _helperService: HelperService,
              public conceptoDialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getConceptos();
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  getConceptos() {
    this.loading = true;
    this._subscriptions.add(this._conceptoService.getConceptos()
        .subscribe(
            data => {
              this.conceptos = data;
              this.loading = false;
            },
            error => {
              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  openConceptoDialog(concepto: IConcepto){
    const dialogRef = this.conceptoDialog.open(ConceptoDialogComponent, { data: {concepto} });

    this._subscriptions.add(dialogRef.afterClosed()
      .subscribe(result => {
        if (result !== undefined) {
          this.getConceptos();
        }
      })
    );
  }

}
