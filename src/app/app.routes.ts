import { Routes } from '@angular/router';
import { OktaCallbackComponent } from '@okta/okta-angular';

export const routes: Routes = [
  { path: 'login/callback', component: OktaCallbackComponent }
];
