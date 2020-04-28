import { UrlConstants } from 'src/app/constants/url.constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { WelcomeComponent } from '../welcome/welcome.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registracion',
  templateUrl: './registracion.component.html',
  styleUrls: ['./registracion.component.css']
})
export class RegistracionComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  startDate = new Date((new Date()).getFullYear() - 20, 0, 1);
  monedas: string[];
  loading = false;
  dialogRef: MatDialogRef<WelcomeComponent>;
  private _subscriptions = new Subscription();

  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
              private _helperService: HelperService,
              private helperService: HelperService,
              private router: Router,
              public welcomeDialog: MatDialog,
              public snackBar: MatSnackBar) { }

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        emailFormControl: ['', [Validators.required, Validators.email]],
        fechaNacimientoFormControl: ['', [Validators.required]],
        nameFormControl: ['', [Validators.required]],
        passwordFormControl: ['', [Validators.required]],
        passwordRepeatFormControl: [''],
        monedaFormControl: ['', [Validators.required]]
      }, {validator: this.usersService.checkPasswords });
      this.monedas = this.usersService.getAvailablesCurrencies();
    }

    ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
    }

    register(): void {
      this.loading  = true;
      const user = this.createUser();

      this._subscriptions.add(this.usersService.register(user)
          .subscribe(
            data => {
              this.loading  = false;
              this.dialogRef = this.welcomeDialog.open(WelcomeComponent, { data: {user} });

              this._subscriptions.add(this.dialogRef.afterClosed()
                .subscribe(() => {
                  this.router.navigate(['/' + UrlConstants.LOGIN]);
                })
              );
            },
            error => {
              this.loading  = false;
              this._helperService.showSnackBarError(this.snackBar, this.helperService.getErrorMessage(error));
            })
      );
    }

    private createUser(): User {
      const user: User = {
        email: this.registerForm.value.emailFormControl,
        fechanacimiento: this.registerForm.value.fechaNacimientoFormControl,
        moneda: this.registerForm.value.monedaFormControl,
        nombre: this.registerForm.value.nameFormControl,
        fechaalta: null,
        id: null,
        idestado: null,
        password: this.registerForm.value.passwordFormControl
      };

      return user;
    }

  }
