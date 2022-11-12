import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CodeBlockType} from "../../enumeration/code-block-type";
import {ErrorService} from "../error.service";
import {catchError, Observable, throwError} from "rxjs";
import {CodeBlockEntity} from "../../entity/code-block-entity";
import {FilterCodeBlock} from "../../dto/filter-code-block";
import {EstimateType} from "../../enumeration/estimate-type";

@Injectable({
  providedIn: 'root'
})
export class CodeBlockService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  createCodeBlock(codeBlockEntity: CodeBlockEntity, token: string): Observable<CodeBlockEntity> {
    return this.http.post<CodeBlockEntity>(
      'http://localhost:8075/api/blocks/create', codeBlockEntity, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  updateCodeBlock(codeBlockEntity: CodeBlockEntity, token: string): Observable<CodeBlockEntity> {
    return this.http.patch<CodeBlockEntity>(
      'http://localhost:8075/api/blocks/update', codeBlockEntity, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  deleteCodeBlock(codeBlockId: string, token: string): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:8075/api/blocks/delete/${codeBlockId}`, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllCodeBlocksByUserId(userId: string, token: string): Observable<Array<CodeBlockEntity>> {
    return this.http.get<Array<CodeBlockEntity>>(
      `http://localhost:8075/api/blocks/get-all/by-user-id/${userId}`, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllCodeBlocksByType(codeBlockType: CodeBlockType): Observable<Array<CodeBlockEntity>> {
    return this.http.get<Array<CodeBlockEntity>>(
      `http://localhost:8075/api/blocks/get-all/by-block-type/${codeBlockType}`)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllFilteredCodeBlocks(filterCodeBlock: FilterCodeBlock): Observable<Array<CodeBlockEntity>> {
    return this.http.post<Array<CodeBlockEntity>>(
      'http://localhost:8075/api/blocks/get-all/filtered', filterCodeBlock)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllFilteredCodeBlocksByUserId(
    userId: string, token: string, filterCodeBlock: FilterCodeBlock): Observable<Array<CodeBlockEntity>> {
    return this.http.post<Array<CodeBlockEntity>>(
      `http://localhost:8075/api/blocks/get-all/by-user-id/${userId}/filtered`,
      filterCodeBlock, {headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllFilteredCodeBlocksByUserIdAndEstimateType(
    userId: string, token: string, estimateType: EstimateType, filterCodeBlock: FilterCodeBlock) {
    return this.http.post<Array<CodeBlockEntity>>(
      `http://localhost:8075/api/blocks/get-all/by-user-id-and-estimate-type/${userId}/${estimateType}/filtered`,
      filterCodeBlock, {headers: { Authorization: token }})
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
