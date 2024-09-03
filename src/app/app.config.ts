import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpBackend, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { OktaAuthConfigService, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { tap, take } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

function configInitializer(httpBackend: HttpBackend, configService: OktaAuthConfigService): () => void {
  return () =>
  new HttpClient(httpBackend)
  .get('api/config.json')
  .pipe(
    tap((authConfig: any) => configService.setConfig({
      oktaAuth: new OktaAuth({
        ...authConfig,
        redirectUri: `${window.location.origin}/login/callback`,
        scopes: ['openid', 'offline_access', 'profile']
      })
    })),
    take(1)
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      OktaAuthModule
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    { provide: APP_INITIALIZER, useFactory: configInitializer, deps: [HttpBackend, OktaAuthConfigService], multi: true },
  ]
};
