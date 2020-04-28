import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit, OnDestroy {
  loading = false;
  loadingAceptar = false;
  profileForm: FormGroup;
  monedas: string[];
  private _subscriptions = new Subscription();

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
    this._subscriptions.unsubscribe();
  }

  getData(): void {
    this.loading = true;

    this._subscriptions.add(this._userService.getProfile()
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
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  changeProfile(): void {
    this.loadingAceptar  = true;

    const userProfile = this.createUser();
    this._subscriptions.add(this._userService.updateProfile(userProfile)
          .subscribe(
            data => {
              this._userService.setUserName(userProfile.nombre);
              this._helperService.showSnackBarSuccess(this.snackBar, 'Modificacion Exitosa');
              this.loadingAceptar  = false;
              this.profileForm.markAsPristine();
            },
            error => {
              this.loadingAceptar  = false;
              this._helperService.showSnackBarError(this.snackBar, this._helperService.getErrorMessage(error));
            })
    );
  }

  private createUser(): User {
    const user: User = {
      email: this.profileForm.value.emailFormControl,
      fechanacimiento: new Date(this.profileForm.value.fechaNacimientoFormControl),
      moneda: this.profileForm.value.monedaFormControl,
      nombre: this.profileForm.value.nameFormControl,
      fechaalta: null,
      id: null,
      idestado: null,
      password: null
    };

    return user;
  }
}
