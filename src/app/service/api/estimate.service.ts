import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {catchError, Observable, throwError} from "rxjs";
import {EstimateEntity} from "../../entity/estimate-entity";

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getAllEstimatesByCodeBlockId(codeBlockId: string): Observable<Array<EstimateEntity>> {
    return this.http.get<Array<EstimateEntity>>(
      `http://localhost:8075/api/estimates/get-all/by-block-id/${codeBlockId}`)
      .pipe(
        catchError(error => this.errorHandle(error))
      )
  }

  createEstimate(estimateEntity: EstimateEntity, token: string): Observable<EstimateEntity> {
    return this.http.post<EstimateEntity>(
      'http://localhost:8075/api/estimates/create', estimateEntity, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  updateEstimate(estimateEntity: EstimateEntity, token: string): Observable<EstimateEntity> {
    return this.http.patch<EstimateEntity>(
      'http://localhost:8075/api/estimates/update', estimateEntity, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  deleteEstimateById(estimateId: string, token: string): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:8075/api/estimates/delete/${estimateId}`, {
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
