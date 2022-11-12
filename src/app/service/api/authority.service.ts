import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {catchError, Observable, throwError} from "rxjs";
import {UserPermissions} from "../../dto/user-permissions";

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getUserPermissions(userId: string, token: string): Observable<UserPermissions> {
    return this.http.get<UserPermissions>(
      `http://localhost:8075/api/authorities/get/${userId}/permissions`, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
