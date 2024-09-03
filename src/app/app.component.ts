import {AsyncPipe, NgIf} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState } from '@okta/okta-auth-js';
import {BehaviorSubject, filter, map} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, RouterLink, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private oktaStateService = inject(OktaAuthStateService);
  protected oktaAuth = inject(OKTA_AUTH);

  protected accessToken: any;

  public isAuthenticated$ = this.oktaStateService.authState$.pipe(
    filter((s: AuthState) => !!s),
    map((s: AuthState) => s.isAuthenticated ?? false)
  );

  copied = false;

  public async signIn() : Promise<void> {
    await this.oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    this.oktaAuth.signOut({clearTokensBeforeRedirect: true}).then(
      (signout) => {
        console.log(signout);
        this.oktaAuth.clearStorage();
      })
      .catch((error) => {
        console.log(error);
        this.oktaAuth.clearStorage();
      });
  }

  copyToken() {
    const accessToken: any = this.oktaAuth.getAccessToken();
    navigator.clipboard.writeText(accessToken);
    this.copied = true;
  }

  ngOnInit(): void {
  }
}

