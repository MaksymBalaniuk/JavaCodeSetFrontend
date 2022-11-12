import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../error.service";
import {catchError, Observable, throwError} from "rxjs";
import {CommentEntity} from "../../entity/comment-entity";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  getAllCommentsByCodeBlockId(codeBlockId: string): Observable<Array<CommentEntity>> {
    return this.http.get<Array<CommentEntity>>(
      `http://localhost:8075/api/comments/get-all/by-block-id/${codeBlockId}`)
      .pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  createComment(commentEntity: CommentEntity, token: string): Observable<CommentEntity> {
    return this.http.post<CommentEntity>(
      'http://localhost:8075/api/comments/create', commentEntity, {
        headers: { Authorization: token }
      }).pipe(
        catchError(error => this.errorHandle(error))
      );
  }

  private errorHandle(error: HttpErrorResponse): Observable<never> {
    this.errorService.handle(error);
    return throwError(() => error.message);
  }
}
