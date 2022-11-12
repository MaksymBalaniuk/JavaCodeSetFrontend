import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LoginRequest} from "../../dto/login-request";
import {catchError, delay, Observable, throwError} from "rxjs";
import {AuthenticationResponse} from "../../dto/authentication-response";
import {ErrorService} from "../error.service";
import {RegisterRequest} from "../../dto/register-request";
import {RegisterResponse} from "../../dto/register-response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  login(loginRequest: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      'http://localhost:8075/api/auth/login', loginRequest)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      'http://localhost:8075/api/auth/register', registerRequest)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
