import { Component, OnInit } from '@angular/core';
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
export class ConceptosComponent implements OnInit {
  displayedColumns: string[] = ['concepto', 'tipo'];
  loading: boolean = false;
  conceptos: IConcepto[] = [];
  private getConceptosSubscription: Subscription;
  private conceptoDialogSubscription: Subscription;

  constructor(private _conceptoService: ConceptoService,
              private _helperService: HelperService,
              public conceptoDialog: MatDialog,
              public snackBar: MatSnackBar){  }

  ngOnInit() {
    this.getConceptos();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetConceptos();
    this.unsubscribeConceptoDialog();
  }

  unsubscribeGetConceptos(): void {
    if (this.getConceptosSubscription){ this.getConceptosSubscription.unsubscribe(); }
  }

  unsubscribeConceptoDialog(): void {
    if (this.conceptoDialogSubscription){ this.getConceptosSubscription.unsubscribe(); }
  }

  getConceptos() {
    this.loading = true;
    this.unsubscribeGetConceptos();
    this.getConceptosSubscription = this._conceptoService.getConceptos()
        .subscribe(
            data => {
              this.conceptos = data;
              this.loading = false;
            },
            error => {
              this.loading = false;
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
  }

  openConceptoDialog(concepto: IConcepto){
    let dialogRef = this.conceptoDialog.open(ConceptoDialogComponent, { data: {concepto} });

    this.unsubscribeConceptoDialog();
    this.getConceptosSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        this.getConceptos();
      }
    });
  }

}
