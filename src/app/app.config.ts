import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { userReducer } from './store/user.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideStore({ users: userReducer }), provideEffects([UserEffects]), provideHttpClient(), provideAnimations(), provideAnimations()]
};
