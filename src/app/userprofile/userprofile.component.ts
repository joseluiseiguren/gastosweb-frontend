import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, throwToolbarMixedModesError } from '@angular/material';
import { User } from '../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loadingAceptar: boolean = false;
  profileForm: FormGroup;
  monedas: string[];
  private getDataSubscription: Subscription;
  private updateProfileSubscription: Subscription;  
  
  constructor(private _userService: UsersService,
              private formBuilder: FormBuilder,
              private _helperService: HelperService,
              public snackBar: MatSnackBar) {  }

  ngOnInit() {
    this.monedas = this._userService.getAvailablesCurrencies();

    this.profileForm = this.formBuilder.group({
      emailFormControl: ['', [Validators.required, Validators.email]],
      fechaNacimientoFormControl: ['', [Validators.required]],
      nameFormControl: ['', [Validators.required]],
      monedaFormControl: ['', [Validators.required]]
    });
    this.getData();
  }

  ngOnDestroy(): void {
    this.unsubscribeGetData();
    this.unsubscribeUpdateProfile();
  }

  unsubscribeGetData() {
    if (this.getDataSubscription){ this.getDataSubscription.unsubscribe(); }    
  }

  unsubscribeUpdateProfile() {
    if (this.updateProfileSubscription){ this.updateProfileSubscription.unsubscribe(); }    
  }

  getData() {
    this.loading = true;

    this.unsubscribeGetData();
    this.getDataSubscription = this._userService.getProfile()
        .subscribe(
            data => {
              this.profileForm.setValue({emailFormControl: data.email, 
                                         nameFormControl: data.nombre, 
                                         fechaNacimientoFormControl: data.fechanacimiento, 
                                         monedaFormControl: data.moneda});
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });              
            });
  }

  changeProfile(){
    this.loadingAceptar  = true;
    
    this.unsubscribeUpdateProfile();
    this.updateProfileSubscription = this._userService.updateProfile(this.createUser())
          .subscribe(
            data => {
              this.snackBar.open("Modificacion Exitosa", '', { duration: 2000, panelClass: ['success-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });              
              this.loadingAceptar  = false;              
              this.profileForm.markAsPristine();
            },
            error => {
              this.loadingAceptar  = false;
              this.snackBar.open(this._helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });              
            });
  }

  private createUser() : User{
    let user = new User();
    user.email = this.profileForm.value.emailFormControl;
    user.fechanacimiento = new Date(this.profileForm.value.fechaNacimientoFormControl);
    user.moneda = this.profileForm.value.monedaFormControl;
    user.nombre = this.profileForm.value.nameFormControl;

    return user;
  }
}



/*import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UsersService } from '../services/users.service';
import { HelperService } from '../services/helper.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  model: User = new User();
  operationMessage: string = "";
  operationMessageStatus: number = 2; // 0 - OK / 1 - Error 
  errorMessage: string = "";
  loading: boolean = false;
  loadingAceptar: boolean = false;
  passwordCheck: string;
  fechaNacim: string;
  monedas = ['$', 'U$D', '€'];

  constructor(private _userService: UsersService,
              private _helperService: HelperService) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.loading = true;
    this.errorMessage = "";
    this._userService.getProfile()
        .subscribe(
            data => {
              data.password = "";
              this.passwordCheck = "";
              this.model = data;
              this.fechaNacim = this._helperService.convertStringYYYMMDDToStringDDMMYYYY(this.model.fechanacimiento.toString());
              this.loading = false;
            },
            error => {
              this.loading = false; 
              this.errorMessage = this._helperService.getErrorMessage(error);
            });
  }

  aceptar(form: NgForm){
    this.loadingAceptar  = true;
    
    if (this.passwordCheck != this.model.password) {
      this.operationMessageStatus = 1;
      this.operationMessage = "Los Password no coinciden";
      this.loadingAceptar  = false;
      return;
    }

    this.model.fechanacimiento = new Date(
      Number(this.fechaNacim.slice(6,10)),
      Number(this.fechaNacim.slice(3,5))-1,
      Number(this.fechaNacim.slice(0,2)),
      0, 0, 0, 0);

    this._userService.updateProfile(this.model)
          .subscribe(
            data => {
              this.operationMessageStatus = 0;
              this.operationMessage = "Modificacion Exitosa";
              form.resetForm();
              this.loadingAceptar  = false;
              this.getData();
            },
            error => {
              this.operationMessageStatus = 1;  
              this.loadingAceptar  = false;
              this.operationMessage = this._helperService.getErrorMessage(error)
            });
  }

}
*/