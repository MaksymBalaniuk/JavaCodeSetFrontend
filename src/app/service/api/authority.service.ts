import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {NetworkService} from "../network.service";
import {catchError, Observable, throwError} from "rxjs";
import {UserPermissions} from "../../dto/user-permissions";

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  constructor(private http: HttpClient,
              private errorService: ErrorService,
              private networkService: NetworkService) { }

  getUserPermissions(userId: string, token: string): Observable<UserPermissions> {
    return this.http.get<UserPermissions>(
      `${this.networkService.getAddress()}/api/authorities/get/${userId}/permissions`,
      { headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
