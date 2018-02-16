import { InjectionToken } from "@angular/core";
import { IAppConfig } from "./app-config.interface";

export const APP_DI_CONFIG: IAppConfig = {
    LOCALE: navigator.language.substring(0,2),
    SEPARADOR_MILES: ".",
    SEPARADOR_DECIMALES: ","
};

export let APP_CONFIG = new InjectionToken< IAppConfig >( 'app.config' );