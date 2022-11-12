import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UserEntity} from "../../entity/user-entity";
import {ErrorService} from "../error.service";
import {PremiumLimits} from "../../dto/premium-limits";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getUserById(userId: string): Observable<UserEntity> {
    return this.http.get<UserEntity>(
      `http://localhost:8075/api/users/get/${userId}`)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getUserPremiumLimits(userId: string, token: string): Observable<PremiumLimits> {
    return this.http.get<PremiumLimits>(
      `http://localhost:8075/api/users/get/${userId}/premium-limits`, {
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
