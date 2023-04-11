import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {NetworkService} from "../network.service";
import {catchError, Observable, throwError} from "rxjs";
import {UserEntity} from "../../entity/user-entity";
import {PremiumLimits} from "../../dto/premium-limits";
import {UserPremium} from "../../enumeration/user-premium";
import {AuthenticationResponse} from "../../dto/authentication-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private errorService: ErrorService,
              private networkService: NetworkService) { }

  getUserById(userId: string): Observable<UserEntity> {
    return this.http.get<UserEntity>(
      `${this.networkService.getAddress()}/api/users/get/${userId}`)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getUserPremiumLimits(userId: string, token: string): Observable<PremiumLimits> {
    return this.http.get<PremiumLimits>(
      `${this.networkService.getAddress()}/api/users/get/${userId}/premium-limits`,
      { headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getPremiumLimitsByUserPremium(userPremium: UserPremium, token: string): Observable<PremiumLimits> {
    return this.http.get<PremiumLimits>(
      `${this.networkService.getAddress()}/api/users/get/premium-limits/by-user-premium/${userPremium}`,
      { headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  updateUserPremiumById(userId: string, userPremium: UserPremium, token: string): Observable<AuthenticationResponse> {
    return this.http.patch<AuthenticationResponse>(
      `${this.networkService.getAddress()}/api/users/update/${userId}/user-premium/${userPremium}`,
      {}, { headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
