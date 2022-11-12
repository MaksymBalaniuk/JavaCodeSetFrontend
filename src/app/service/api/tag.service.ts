import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {catchError, Observable, throwError} from "rxjs";
import {TagEntity} from "../../entity/tag-entity";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  createTag(tagEntity: TagEntity, token: string): Observable<TagEntity> {
    return this.http.post<TagEntity>(
      'http://localhost:8075/api/tags/create', tagEntity, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  addTagToCodeBlock(tagId: string, codeBlockId: string, token: string): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8075/api/tags/add/tag-to-block/${tagId}/${codeBlockId}`, {}, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  deleteTagFromCodeBlock(tagId: string, codeBlockId: string, token: string): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:8075/api/tags/delete/tag-from-block/${tagId}/${codeBlockId}`, {
        headers: { Authorization: token }
      })
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  getAllTagsByCodeBlockId(codeBlockId: string): Observable<Array<TagEntity>> {
    return this.http.get<Array<TagEntity>>(
      `http://localhost:8075/api/tags/get-all/by-block-id/${codeBlockId}`).pipe(
      catchError(error => this.errorHandle(error))
    )
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
