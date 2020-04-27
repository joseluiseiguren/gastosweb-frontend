import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HelperService } from '../../services/helper.service';
import { IpService } from '../../services/ip.service';
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
  loading: boolean = false;
  dialogRef: MatDialogRef<WelcomeComponent>;
  private registerSubscription: Subscription;
  private dialogSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
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
      this.unsubscribeRegister();
      this.unsubscribeDialog();
    }

    unsubscribeRegister(): void {
      if (this.registerSubscription){ this.registerSubscription.unsubscribe(); }
    }

    unsubscribeDialog(): void {
      if (this.dialogSubscription){ this.dialogSubscription.unsubscribe(); }
    }

    register (){
      this.loading  = true;
      let user = this.createUser();

      this.unsubscribeRegister();
      this.registerSubscription = this.usersService.register(user)
          .subscribe(
            data => {
              this.loading  = false;
              this.dialogRef = this.welcomeDialog.open(WelcomeComponent, { data: {user} });

              this.unsubscribeDialog();
              this.dialogSubscription = this.dialogRef.afterClosed().subscribe(() => {
                this.router.navigate(['/login']);
              });
            },
            error => {
              this.loading  = false;
              this.snackBar.open(this.helperService.getErrorMessage(error), '', { duration: 2000, panelClass: ['error-snackbar'], direction: 'ltr', verticalPosition: 'bottom' });
            });
    }

    private createUser() : User{
      let user = new User();
      user.email = this.registerForm.value.emailFormControl;
      user.password = this.registerForm.value.passwordFormControl;
      user.fechanacimiento = this.registerForm.value.fechaNacimientoFormControl;
      user.moneda = this.registerForm.value.monedaFormControl;
      user.nombre = this.registerForm.value.nameFormControl;

      return user;
    }

  }
