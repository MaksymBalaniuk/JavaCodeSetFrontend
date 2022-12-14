import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  isAuthenticationFormVisible = false;
  isRegistrationFormVisible = false;
  isSessionExpiredFormVisible = false;

  showAuthenticationForm(): void {
    this.isAuthenticationFormVisible = true;
  }

  showRegistrationForm(): void {
    this.isRegistrationFormVisible = true;
  }

  showSessionExpiredForm(): void {
    this.isSessionExpiredFormVisible = true;
  }

  hideForm(): void {
    this.isAuthenticationFormVisible = false;
    this.isRegistrationFormVisible = false;
    this.isSessionExpiredFormVisible = false;
  }
}
