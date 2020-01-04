import { Injectable, Inject, LOCALE_ID } from '@angular/core';
/*import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { enGbLocale } from 'ngx-bootstrap/locale';*/
import { IAppConfig } from '../app.config/app-config.interface';
import { APP_CONFIG } from '../app.config/app-config.constants';
/*import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('es', esLocale); 
defineLocale('en', enGbLocale);*/

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es'); 

@Injectable()
export class LocalizacionService {
  
  /*constructor(private _localeService: BsLocaleService,
              @Inject( APP_CONFIG ) private _appConfig: IAppConfig) { 
    this._localeService.use(this._appConfig.LOCALE);  
  }*/
}
