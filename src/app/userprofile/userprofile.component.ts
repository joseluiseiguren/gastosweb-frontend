import { Component, OnInit } from '@angular/core';
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
  operationMessageStatus: number = 2; /* 0 - OK / 1 - Error */
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
