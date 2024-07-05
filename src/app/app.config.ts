import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

//To enable httpClient on server site with fetch i need the following configuration

//import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
//export const appConfig: ApplicationConfig = {
//  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(withFetch()),importProvidersFrom(HttpClientModule)]
//};




export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()), provideClientHydration(),provideHttpClient(withFetch()),importProvidersFrom(HttpClientModule)]
};
